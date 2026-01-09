import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'John Doe', required: false })
  author?: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Great book!', required: false })
  text?: string;

  @ApiProperty({ example: 'Highly recommended', required: false })
  title?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', required: false })
  reviewDate?: Date;

  @ApiProperty({ example: true })
  verifiedPurchase: boolean;

  @ApiProperty({ example: 15 })
  helpfulCount: number;

  @ApiProperty({ example: '2024-01-09T10:00:00Z' })
  createdAt: Date;
}
