import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MarketplaceStatus } from '../generated/prisma';
import { IsArray, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';
class ItemDto { @IsString() title!: string; @IsString() @MinLength(10) description!: string; @IsNumber() price!: number; @IsString() category!: string; @IsOptional() @IsArray() photoUrls?: string[]; }
@Controller('marketplace')
export class MarketplaceController {
  constructor(private prisma: PrismaService) {}
  @Public() @Get() list(@Query('q') q?: string, @Query('category') category?: string) {
    return this.prisma.marketplaceItem.findMany({ where: { status: 'ACTIVE', ...(category ? { category } : {}), ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}) }, orderBy: { createdAt: 'desc' } });
  }
  @Post() create(@CurrentUser() user: any, @Body() dto: ItemDto) { return this.prisma.marketplaceItem.create({ data: { ...dto, sellerId: user.sub } }); }
  @Patch(':id') async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: ItemDto) {
    const item = await this.prisma.marketplaceItem.findUniqueOrThrow({ where: { id } });
    if (item.sellerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'marketplace.update', entity: 'marketplaceItem', entityId: id } });
    return this.prisma.marketplaceItem.update({ where: { id }, data: dto });
  }
  @Post(':id/sold') async markSold(@CurrentUser() user: any, @Param('id') id: string) {
    const item = await this.prisma.marketplaceItem.findUniqueOrThrow({ where: { id } });
    if (item.sellerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    return this.prisma.marketplaceItem.update({ where: { id }, data: { status: MarketplaceStatus.SOLD } });
  }
  @Delete(':id') async remove(@CurrentUser() user: any, @Param('id') id: string) {
    const item = await this.prisma.marketplaceItem.findUniqueOrThrow({ where: { id } });
    if (item.sellerId !== user.sub && !['ADMIN', 'MODERATOR'].includes(user.role)) throw new ForbiddenException();
    await this.prisma.auditLog.create({ data: { actorId: user.sub, action: 'marketplace.delete', entity: 'marketplaceItem', entityId: id } });
    return this.prisma.marketplaceItem.update({ where: { id }, data: { status: MarketplaceStatus.ARCHIVED } });
  }
}
