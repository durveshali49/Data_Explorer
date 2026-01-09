import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'product-12345' })
  sourceId: string;

  @ApiProperty({ example: 'The Great Gatsby' })
  title: string;

  @ApiProperty({ example: 'F. Scott Fitzgerald', required: false })
  author?: string;

  @ApiProperty({ example: 8.99 })
  price: number;

  @ApiProperty({ example: 'GBP' })
  currency: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 'https://www.worldofbooks.com/product/12345' })
  sourceUrl: string;

  @ApiProperty({ example: 'In Stock', required: false })
  availability?: string;

  @ApiProperty({ example: 'Used - Good', required: false })
  condition?: string;

  @ApiProperty({ example: '2024-01-09T12:00:00Z', required: false })
  lastScrapedAt?: Date;

  @ApiProperty({ example: '2024-01-09T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-09T12:00:00Z' })
  updatedAt: Date;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductDto] })
  items: ProductDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 24 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
