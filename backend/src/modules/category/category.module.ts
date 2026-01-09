import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../database/entities';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryScraperService } from '../../scraper';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryScraperService],
  exports: [CategoryService],
})
export class CategoryModule {}
