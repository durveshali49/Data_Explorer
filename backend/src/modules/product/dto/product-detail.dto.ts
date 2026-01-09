import { ApiProperty } from '@nestjs/swagger';

export class ProductDetailDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'A classic novel...' })
  description?: string;

  @ApiProperty({ 
    example: { Publisher: 'Penguin', Pages: '180', ISBN: '978-0141182636' },
    required: false 
  })
  specs?: Record<string, any>;

  @ApiProperty({ example: 4.5, required: false })
  ratingsAvg?: number;

  @ApiProperty({ example: 120 })
  reviewsCount: number;

  @ApiProperty({ example: '978-0141182636', required: false })
  isbn?: string;

  @ApiProperty({ example: 'Penguin Books', required: false })
  publisher?: string;

  @ApiProperty({ example: '2004-05-27', required: false })
  publicationDate?: Date;

  @ApiProperty({ example: 180, required: false })
  pageCount?: number;

  @ApiProperty({ example: 'Paperback', required: false })
  format?: string;

  @ApiProperty({ 
    example: ['https://www.worldofbooks.com/product/12346'],
    required: false 
  })
  recommendations?: string[];
}
