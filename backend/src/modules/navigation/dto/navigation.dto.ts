import { ApiProperty } from '@nestjs/swagger';

export class NavigationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Books' })
  title: string;

  @ApiProperty({ example: 'books' })
  slug: string;

  @ApiProperty({ example: 'Browse all books', required: false })
  description?: string;

  @ApiProperty({ example: 'https://www.worldofbooks.com/en-gb/books', required: false })
  sourceUrl?: string;

  @ApiProperty({ example: '2024-01-09T12:00:00Z', required: false })
  lastScrapedAt?: Date;

  @ApiProperty({ example: '2024-01-09T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-09T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: 5, description: 'Number of categories' })
  categoryCount?: number;
}
