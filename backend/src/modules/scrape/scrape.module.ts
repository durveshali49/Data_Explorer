import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScrapeJob } from '../../database/entities';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import { NavigationModule } from '../navigation/navigation.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrapeJob]),
    BullModule.registerQueue({
      name: 'scrape',
    }),
    NavigationModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [ScrapeController],
  providers: [ScrapeService],
  exports: [ScrapeService],
})
export class ScrapeModule {}
