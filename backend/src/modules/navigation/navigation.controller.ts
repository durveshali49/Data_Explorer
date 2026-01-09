import { Controller, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { NavigationDto } from './dto/navigation.dto';

@ApiTags('navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all navigation headings' })
  @ApiResponse({ status: 200, description: 'Returns all navigation headings', type: [NavigationDto] })
  async findAll() {
    return this.navigationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get navigation by ID' })
  @ApiParam({ name: 'id', description: 'Navigation ID' })
  @ApiResponse({ status: 200, description: 'Returns navigation details', type: NavigationDto })
  @ApiResponse({ status: 404, description: 'Navigation not found' })
  async findOne(@Param('id') id: string) {
    return this.navigationService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get navigation by slug' })
  @ApiParam({ name: 'slug', description: 'Navigation slug' })
  @ApiResponse({ status: 200, description: 'Returns navigation details', type: NavigationDto })
  @ApiResponse({ status: 404, description: 'Navigation not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.navigationService.findBySlug(slug);
  }

  @Post('scrape')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger navigation scraping' })
  @ApiResponse({ status: 200, description: 'Navigation scraped and saved', type: [NavigationDto] })
  async scrape() {
    return this.navigationService.scrapeAndSave();
  }
}
