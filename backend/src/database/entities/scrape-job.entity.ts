import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ScrapeJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ScrapeJobType {
  NAVIGATION = 'navigation',
  CATEGORY = 'category',
  PRODUCT_LIST = 'product_list',
  PRODUCT_DETAIL = 'product_detail',
}

@Entity('scrape_job')
export class ScrapeJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'target_url', type: 'text' })
  @Index()
  targetUrl: string;

  @Column({ name: 'target_type', type: 'enum', enum: ScrapeJobType })
  @Index()
  targetType: ScrapeJobType;

  @Column({ name: 'target_id', nullable: true })
  @Index()
  targetId: string;

  @Column({ type: 'enum', enum: ScrapeJobStatus, default: ScrapeJobStatus.PENDING })
  @Index()
  status: ScrapeJobStatus;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'finished_at', type: 'timestamp', nullable: true })
  finishedAt: Date;

  @Column({ name: 'error_log', type: 'text', nullable: true })
  errorLog: string;

  @Column({ name: 'items_scraped', default: 0 })
  itemsScraped: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
