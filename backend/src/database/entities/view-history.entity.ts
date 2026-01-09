import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('view_history')
export class ViewHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId: string;

  @Column({ name: 'session_id' })
  @Index()
  sessionId: string;

  @Column({ type: 'jsonb' })
  pathJson: {
    navigation?: string;
    category?: string;
    product?: string;
    url: string;
    title: string;
  };

  @Column({ nullable: true })
  ip: string;

  @Column({ name: 'user_agent', nullable: true, type: 'text' })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;
}
