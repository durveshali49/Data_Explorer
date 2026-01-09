import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'int' })
  @Index()
  rating: number;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ nullable: true })
  title: string;

  @Column({ name: 'review_date', type: 'timestamp', nullable: true })
  reviewDate: Date;

  @Column({ name: 'verified_purchase', default: false })
  verifiedPurchase: boolean;

  @Column({ name: 'helpful_count', default: 0 })
  helpfulCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
