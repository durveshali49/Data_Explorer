import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities';
import { CategoryScraperService } from '../../scraper';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryScraperService: CategoryScraperService,
  ) {}

  async findAll(navigationId?: string, parentId?: string): Promise<Category[]> {
    const where: any = {};
    
    if (navigationId) where.navigationId = navigationId;
    if (parentId) where.parentId = parentId;
    if (parentId === null) where.parentId = null;

    return this.categoryRepository.find({
      where,
      relations: ['children', 'navigation'],
      order: { title: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children', 'parent', 'navigation', 'products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['children', 'parent', 'navigation', 'products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async scrapeAndSave(url: string, navigationId?: string, parentId?: string): Promise<Category[]> {
    this.logger.log(`Triggering category scrape from: ${url}`);
    
    try {
      const scrapedItems = await this.categoryScraperService.scrapeCategory(url);
      const savedItems: Category[] = [];

      for (const item of scrapedItems) {
        let category = await this.categoryRepository.findOne({
          where: { slug: item.slug },
        });

        if (category) {
          // Update existing
          category.title = item.title;
          category.sourceUrl = item.url;
          category.productCount = item.productCount || category.productCount;
          category.lastScrapedAt = new Date();
        } else {
          // Create new
          category = this.categoryRepository.create({
            title: item.title,
            slug: item.slug,
            sourceUrl: item.url,
            productCount: item.productCount || 0,
            navigationId,
            parentId,
            lastScrapedAt: new Date(),
          });
        }

        savedItems.push(await this.categoryRepository.save(category));
      }

      this.logger.log(`Saved ${savedItems.length} categories`);
      return savedItems;
    } catch (error) {
      this.logger.error(`Failed to scrape and save categories: ${error.message}`);
      throw error;
    }
  }

  async shouldRescrape(id: string, cacheTtl: number = 3600): Promise<boolean> {
    const category = await this.findOne(id);
    
    if (!category.lastScrapedAt) {
      return true;
    }

    const now = new Date();
    const lastScraped = new Date(category.lastScrapedAt);
    const diffInSeconds = (now.getTime() - lastScraped.getTime()) / 1000;

    return diffInSeconds > cacheTtl;
  }
}
