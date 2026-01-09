import { Controller, Get, Post, Param, Query, Body, HttpCode, HttpStatus, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto, PaginatedProductsDto } from './dto/product.dto';
import { ProductDetailDto } from './dto/product-detail.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 24 })
  @ApiResponse({ status: 200, description: 'Returns paginated products', type: PaginatedProductsDto })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit: number = 24,
  ) {
    return this.productService.findAll(categoryId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Returns product details', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('source/:sourceId')
  @ApiOperation({ summary: 'Get product by source ID' })
  @ApiParam({ name: 'sourceId', description: 'Product source ID' })
  @ApiResponse({ status: 200, description: 'Returns product details', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySourceId(@Param('sourceId') sourceId: string) {
    return this.productService.findBySourceId(sourceId);
  }

  @Post('scrape')
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
  @ApiResponse({ status: 200, description: 'Products scraped and saved', type: [ProductDto] })
  async scrapeProducts(
    @Body() body: { url: string; categoryId?: string; page?: number; limit?: number },
  ) {
    return this.productService.scrapeProducts(
      body.url,
      body.categoryId,
      body.page || 1,
      body.limit || 24,
    );
  }

  @Post(':id/scrape-detail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger product detail scraping' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product detail scraped and saved', type: ProductDetailDto })
  async scrapeDetail(@Param('id') id: string) {
    return this.productService.scrapeProductDetail(id);
  }
}
