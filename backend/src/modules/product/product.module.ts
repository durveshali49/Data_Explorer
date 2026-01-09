import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductDetail, Review } from '../../database/entities';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductScraperService, ProductDetailScraperService } from '../../scraper';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductDetail, Review])],
  controllers: [ProductController],
  providers: [ProductService, ProductScraperService, ProductDetailScraperService],
  exports: [ProductService],
})
export class ProductModule {}
