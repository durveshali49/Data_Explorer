import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductDetail, Review } from '../../database/entities';
import { ProductScraperService, ProductDetailScraperService } from '../../scraper';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private productScraperService: ProductScraperService,
    private productDetailScraperService: ProductDetailScraperService,
  ) {}

  async findAll(
    categoryId?: string,
    page: number = 1,
    limit: number = 24,
  ): Promise<{ items: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'detail', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySourceId(sourceId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { sourceId },
      relations: ['category', 'detail', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with source ID ${sourceId} not found`);
    }

    return product;
  }

  async scrapeProducts(url: string, categoryId?: string, page: number = 1, limit: number = 24): Promise<Product[]> {
    this.logger.log(`Scraping products from: ${url}`);
    
    try {
      const scrapedItems = await this.productScraperService.scrapeProducts(url, page, limit);
      const savedProducts: Product[] = [];

      for (const item of scrapedItems) {
        let product = await this.productRepository.findOne({
          where: { sourceId: item.sourceId },
        });

        if (product) {
          // Update existing
          Object.assign(product, {
            title: item.title,
            author: item.author,
            price: item.price,
            currency: item.currency,
            imageUrl: item.imageUrl,
            sourceUrl: item.sourceUrl,
            availability: item.availability,
            condition: item.condition,
            lastScrapedAt: new Date(),
          });
        } else {
          // Create new
          product = this.productRepository.create({
            ...item,
            categoryId,
            lastScrapedAt: new Date(),
          });
        }

        savedProducts.push(await this.productRepository.save(product));
      }

      this.logger.log(`Saved ${savedProducts.length} products`);
      return savedProducts;
    } catch (error) {
      this.logger.error(`Failed to scrape products: ${error.message}`);
      throw error;
    }
  }

  async scrapeProductDetail(productId: string): Promise<ProductDetail> {
    this.logger.log(`Scraping product detail for: ${productId}`);
    
    const product = await this.findOne(productId);
    
    try {
      const scrapedDetail = await this.productDetailScraperService.scrapeProductDetail(product.sourceUrl);
      
      let detail = await this.productDetailRepository.findOne({
        where: { productId },
      });

      if (detail) {
        // Update existing
        Object.assign(detail, scrapedDetail);
      } else {
        // Create new
        detail = this.productDetailRepository.create({
          productId,
          ...scrapedDetail,
        });
      }

      const savedDetail = await this.productDetailRepository.save(detail);

      // Save reviews if present
      if (scrapedDetail.reviews && scrapedDetail.reviews.length > 0) {
        await this.saveReviews(productId, scrapedDetail.reviews);
      }

      // Update product last scraped time
      product.lastScrapedAt = new Date();
      await this.productRepository.save(product);

      this.logger.log(`Product detail scraped and saved`);
      return savedDetail;
    } catch (error) {
      this.logger.error(`Failed to scrape product detail: ${error.message}`);
      throw error;
    }
  }

  private async saveReviews(productId: string, reviewsData: any[]): Promise<void> {
    for (const reviewData of reviewsData) {
      const review = this.reviewRepository.create({
        productId,
        ...reviewData,
      });
      await this.reviewRepository.save(review);
    }
  }

  async shouldRescrape(id: string, cacheTtl: number = 3600): Promise<boolean> {
    const product = await this.findOne(id);
    
    if (!product.lastScrapedAt) {
      return true;
    }

    const now = new Date();
    const lastScraped = new Date(product.lastScrapedAt);
    const diffInSeconds = (now.getTime() - lastScraped.getTime()) / 1000;

    return diffInSeconds > cacheTtl;
  }
}
