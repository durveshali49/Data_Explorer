import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../../database/entities';
import { NavigationScraperService } from '../../scraper';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    private navigationScraperService: NavigationScraperService,
  ) {}

  async findAll(): Promise<Navigation[]> {
    return this.navigationRepository.find({
      relations: ['categories'],
      order: { title: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Navigation> {
    const navigation = await this.navigationRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!navigation) {
      throw new NotFoundException(`Navigation with ID ${id} not found`);
    }

    return navigation;
  }

  async findBySlug(slug: string): Promise<Navigation> {
    const navigation = await this.navigationRepository.findOne({
      where: { slug },
      relations: ['categories'],
    });

    if (!navigation) {
      throw new NotFoundException(`Navigation with slug ${slug} not found`);
    }

    return navigation;
  }

  async scrapeAndSave(): Promise<Navigation[]> {
    this.logger.log('Triggering navigation scrape...');
    
    try {
      const scrapedItems = await this.navigationScraperService.scrapeNavigation();
      const savedItems: Navigation[] = [];

      for (const item of scrapedItems) {
        let navigation = await this.navigationRepository.findOne({
          where: { slug: item.slug },
        });

        if (navigation) {
          // Update existing
          navigation.title = item.title;
          navigation.sourceUrl = item.url;
          navigation.lastScrapedAt = new Date();
        } else {
          // Create new
          navigation = this.navigationRepository.create({
            title: item.title,
            slug: item.slug,
            sourceUrl: item.url,
            lastScrapedAt: new Date(),
          });
        }

        savedItems.push(await this.navigationRepository.save(navigation));
      }

      this.logger.log(`Saved ${savedItems.length} navigation items`);
      return savedItems;
    } catch (error) {
      this.logger.error(`Failed to scrape and save navigation: ${error.message}`);
      throw error;
    }
  }

  async shouldRescrape(id: string, cacheTtl: number = 3600): Promise<boolean> {
    const navigation = await this.findOne(id);
    
    if (!navigation.lastScrapedAt) {
      return true;
    }

    const now = new Date();
    const lastScraped = new Date(navigation.lastScrapedAt);
    const diffInSeconds = (now.getTime() - lastScraped.getTime()) / 1000;

    return diffInSeconds > cacheTtl;
  }
}
