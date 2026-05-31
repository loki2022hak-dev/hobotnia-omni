import { Body, Controller, Post } from '@nestjs/common';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
class ReportDto { @IsOptional() @IsString() postId?: string; @IsOptional() @IsString() commentId?: string; @IsString() @MinLength(4) reason!: string; }
@Controller('reports')
export class ReportsController {
  constructor(private prisma: PrismaService) {}
  @Post() create(@CurrentUser() user: any, @Body() dto: ReportDto) { return this.prisma.report.create({ data: { authorId: user.sub, ...dto } }); }
}
