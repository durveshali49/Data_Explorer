import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../../database/entities';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { NavigationScraperService } from '../../scraper';

@Module({
  imports: [TypeOrmModule.forFeature([Navigation])],
  controllers: [NavigationController],
  providers: [NavigationService, NavigationScraperService],
  exports: [NavigationService],
})
export class NavigationModule {}
