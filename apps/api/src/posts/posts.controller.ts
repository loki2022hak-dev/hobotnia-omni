import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}
  @Public() @Get() feed() { return this.posts.feed(); }
  @Post() create(@CurrentUser() user: any, @Body() dto: CreatePostDto) { return this.posts.create(user.sub, dto); }
  @Patch(':id') update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdatePostDto) { return this.posts.update(user, id, dto); }
  @Delete(':id') remove(@CurrentUser() user: any, @Param('id') id: string) { return this.posts.remove(user, id); }
  @Post(':id/like') like(@CurrentUser() user: any, @Param('id') id: string) { return this.posts.toggleLike(user.sub, id); }
  @Post(':id/save') save(@CurrentUser() user: any, @Param('id') id: string) { return this.posts.save(user.sub, id); }
  @Post(':id/repost') repost(@CurrentUser() user: any, @Param('id') id: string) { return this.posts.repost(user.sub, id); }
}
