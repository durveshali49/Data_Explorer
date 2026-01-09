import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Fiction' })
  title: string;

  @ApiProperty({ example: 'fiction' })
  slug: string;

  @ApiProperty({ example: 'Browse fiction books', required: false })
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  navigationId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  parentId?: string;

  @ApiProperty({ example: 150 })
  productCount: number;

  @ApiProperty({ example: 'https://www.worldofbooks.com/en-gb/books/fiction', required: false })
  sourceUrl?: string;

  @ApiProperty({ example: '2024-01-09T12:00:00Z', required: false })
  lastScrapedAt?: Date;

  @ApiProperty({ example: '2024-01-09T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-09T12:00:00Z' })
  updatedAt: Date;
}
