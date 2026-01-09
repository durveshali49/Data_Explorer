import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ScrapeJob, ScrapeJobStatus, ScrapeJobType } from '../../database/entities';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  constructor(
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
    @InjectQueue('scrape')
    private scrapeQueue: Queue,
    private navigationService: NavigationService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {}

  async createJob(
    targetUrl: string,
    targetType: ScrapeJobType,
    targetId?: string,
  ): Promise<ScrapeJob> {
    const job = this.scrapeJobRepository.create({
      targetUrl,
      targetType,
      targetId,
      status: ScrapeJobStatus.PENDING,
    });

    const savedJob = await this.scrapeJobRepository.save(job);
    
    // Add to queue
    await this.scrapeQueue.add('scrape-job', {
      jobId: savedJob.id,
      targetUrl,
      targetType,
      targetId,
    });

    this.logger.log(`Created scrape job ${savedJob.id} for ${targetType}`);
    return savedJob;
  }

  async getJob(id: string): Promise<ScrapeJob> {
    return this.scrapeJobRepository.findOne({ where: { id } });
  }

  async getJobs(status?: ScrapeJobStatus, limit: number = 50): Promise<ScrapeJob[]> {
    const where: any = {};
    if (status) where.status = status;

    return this.scrapeJobRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async updateJobStatus(
    id: string,
    status: ScrapeJobStatus,
    error?: string,
    itemsScraped?: number,
  ): Promise<ScrapeJob> {
    const job = await this.getJob(id);
    
    job.status = status;
    if (error) job.errorLog = error;
    if (itemsScraped !== undefined) job.itemsScraped = itemsScraped;

    if (status === ScrapeJobStatus.RUNNING && !job.startedAt) {
      job.startedAt = new Date();
    }

    if (status === ScrapeJobStatus.COMPLETED || status === ScrapeJobStatus.FAILED) {
      job.finishedAt = new Date();
    }

    return this.scrapeJobRepository.save(job);
  }

  // Direct scrape methods (can be called from API or queue)
  async scrapeNavigation(): Promise<any> {
    const job = await this.createJob(
      'https://www.worldofbooks.com',
      ScrapeJobType.NAVIGATION,
    );

    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);
      const result = await this.navigationService.scrapeAndSave();
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, null, result.length);
      return { job, items: result };
    } catch (error) {
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  async scrapeCategory(url: string, navigationId?: string, parentId?: string): Promise<any> {
    const job = await this.createJob(url, ScrapeJobType.CATEGORY);

    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);
      const result = await this.categoryService.scrapeAndSave(url, navigationId, parentId);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, null, result.length);
      return { job, items: result };
    } catch (error) {
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  async scrapeProducts(url: string, categoryId?: string, page: number = 1, limit: number = 24): Promise<any> {
    const job = await this.createJob(url, ScrapeJobType.PRODUCT_LIST);

    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);
      const result = await this.productService.scrapeProducts(url, categoryId, page, limit);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, null, result.length);
      return { job, items: result };
    } catch (error) {
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }

  async scrapeProductDetail(productId: string): Promise<any> {
    const product = await this.productService.findOne(productId);
    const job = await this.createJob(product.sourceUrl, ScrapeJobType.PRODUCT_DETAIL, productId);

    try {
      await this.updateJobStatus(job.id, ScrapeJobStatus.RUNNING);
      const result = await this.productService.scrapeProductDetail(productId);
      await this.updateJobStatus(job.id, ScrapeJobStatus.COMPLETED, null, 1);
      return { job, detail: result };
    } catch (error) {
      await this.updateJobStatus(job.id, ScrapeJobStatus.FAILED, error.message);
      throw error;
    }
  }
}
