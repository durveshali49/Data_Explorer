import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewHistory } from '../../database/entities';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectRepository(ViewHistory)
    private historyRepository: Repository<ViewHistory>,
  ) {}

  async createEntry(
    sessionId: string,
    pathJson: any,
    userId?: string,
    ip?: string,
    userAgent?: string,
  ): Promise<ViewHistory> {
    const entry = this.historyRepository.create({
      sessionId,
      userId,
      pathJson,
      ip,
      userAgent,
    });

    return this.historyRepository.save(entry);
  }

  async getBySession(sessionId: string, limit: number = 50): Promise<ViewHistory[]> {
    return this.historyRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getByUser(userId: string, limit: number = 50): Promise<ViewHistory[]> {
    return this.historyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecent(limit: number = 100): Promise<ViewHistory[]> {
    return this.historyRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async deleteOldEntries(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.historyRepository
      .createQueryBuilder()
      .delete()
      .where('created_at < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Deleted ${result.affected} old history entries`);
    return result.affected || 0;
  }
}
