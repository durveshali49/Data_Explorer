import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'source_id', unique: true })
  @Index()
  sourceId: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, category => category.products, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  @Index()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ length: 3, default: 'GBP' })
  currency: string;

  @Column({ name: 'image_url', nullable: true, type: 'text' })
  imageUrl: string;

  @Column({ name: 'source_url', unique: true, type: 'text' })
  @Index()
  sourceUrl: string;

  @Column({ name: 'availability', nullable: true })
  availability: string;

  @Column({ name: 'condition', nullable: true })
  condition: string;

  @Column({ name: 'last_scraped_at', type: 'timestamp', nullable: true })
  @Index()
  lastScrapedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => ProductDetail, detail => detail.product, { cascade: true })
  detail: ProductDetail;

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}
