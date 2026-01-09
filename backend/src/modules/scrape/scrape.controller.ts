import { Controller, Get, Post, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ScrapeService } from './scrape.service';
import { ScrapeJobStatus } from '../../database/entities';

@ApiTags('scrape')
@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Get('jobs')
  @ApiOperation({ summary: 'Get scrape jobs' })
  @ApiQuery({ name: 'status', required: false, enum: ScrapeJobStatus })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiResponse({ status: 200, description: 'Returns scrape jobs' })
  async getJobs(
    @Query('status') status?: ScrapeJobStatus,
    @Query('limit') limit: number = 50,
  ) {
    return this.scrapeService.getJobs(status, limit);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get scrape job by ID' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Returns job details' })
  async getJob(@Param('id') id: string) {
    return this.scrapeService.getJob(id);
  }

  @Post('navigation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger navigation scraping' })
  @ApiResponse({ status: 200, description: 'Navigation scraping initiated' })
  async scrapeNavigation() {
    return this.scrapeService.scrapeNavigation();
  }

  @Post('category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger category scraping' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://www.worldofbooks.com/en-gb/books' },
        navigationId: { type: 'string' },
        parentId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category scraping initiated' })
  async scrapeCategory(
    @Body() body: { url: string; navigationId?: string; parentId?: string },
  ) {
    return this.scrapeService.scrapeCategory(body.url, body.navigationId, body.parentId);
  }

  @Post('products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger product scraping' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://www.worldofbooks.com/en-gb/books/fiction' },
        categoryId: { type: 'string' },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 24 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product scraping initiated' })
  async scrapeProducts(
    @Body() body: { url: string; categoryId?: string; page?: number; limit?: number },
  ) {
    return this.scrapeService.scrapeProducts(
      body.url,
      body.categoryId,
      body.page || 1,
      body.limit || 24,
    );
  }

  @Post('product/:id/detail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger product detail scraping' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product detail scraping initiated' })
  async scrapeProductDetail(@Param('id') id: string) {
    return this.scrapeService.scrapeProductDetail(id);
  }
}
