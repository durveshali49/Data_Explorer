import { Controller, Get, Post, Param, Query, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'navigationId', required: false, description: 'Filter by navigation ID' })
  @ApiQuery({ name: 'parentId', required: false, description: 'Filter by parent category ID' })
  @ApiResponse({ status: 200, description: 'Returns all categories', type: [CategoryDto] })
  async findAll(
    @Query('navigationId') navigationId?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.categoryService.findAll(navigationId, parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Returns category details', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ status: 200, description: 'Returns category details', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Post('scrape')
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
  @ApiResponse({ status: 200, description: 'Categories scraped and saved', type: [CategoryDto] })
  async scrape(
    @Body() body: { url: string; navigationId?: string; parentId?: string },
  ) {
    return this.categoryService.scrapeAndSave(body.url, body.navigationId, body.parentId);
  }
}
