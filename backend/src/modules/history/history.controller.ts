import { Controller, Get, Post, Body, Query, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create browsing history entry' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sessionId: { type: 'string', example: 'session-123' },
        pathJson: {
          type: 'object',
          example: {
            navigation: 'books',
            category: 'fiction',
            product: 'product-123',
            url: '/products/product-123',
            title: 'The Great Gatsby',
          },
        },
        userId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'History entry created' })
  async create(
    @Body() body: { sessionId: string; pathJson: any; userId?: string },
    @Req() req: Request,
  ) {
    return this.historyService.createEntry(
      body.sessionId,
      body.pathJson,
      body.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Get('session')
  @ApiOperation({ summary: 'Get browsing history by session' })
  @ApiQuery({ name: 'sessionId', description: 'Session ID' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiResponse({ status: 200, description: 'Returns browsing history' })
  async getBySession(
    @Query('sessionId') sessionId: string,
    @Query('limit') limit: number = 50,
  ) {
    return this.historyService.getBySession(sessionId, limit);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get browsing history by user' })
  @ApiQuery({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiResponse({ status: 200, description: 'Returns browsing history' })
  async getByUser(
    @Query('userId') userId: string,
    @Query('limit') limit: number = 50,
  ) {
    return this.historyService.getByUser(userId, limit);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent browsing history' })
  @ApiQuery({ name: 'limit', required: false, example: 100 })
  @ApiResponse({ status: 200, description: 'Returns recent browsing history' })
  async getRecent(@Query('limit') limit: number = 100) {
    return this.historyService.getRecent(limit);
  }
}
