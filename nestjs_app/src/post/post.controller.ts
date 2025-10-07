import { Types } from 'mongoose';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorize.guard';
import { userRoles } from 'src/utility/userRoles';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/user/models/user.model';
import { Post as PostType } from './models/post.model';
import { PostApproveDto } from './dto/post-approve-dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizeGuard([userRoles.Auther]))
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: User,
  ): Promise<PostType> {
    return await this.postService.create(createPostDto, currentUser);
  }

  @Put('/approve')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([userRoles.Admin]))
  async approve(@Body() postApproveDto: PostApproveDto): Promise<any> {
    return await this.postService.approve(postApproveDto);
  }

  @Get('/get/all')
  @UseGuards(AuthenticationGuard, AuthorizeGuard([userRoles.Admin]))
  async getAllPostByAdmin() {
    return await this.postService.getAllPostByAdmin();
  }

  @Put('/:postId/likes')
  @UseGuards(AuthenticationGuard)
  async likes(
    @Param('postId') postId: string,
    @CurrentUser() currentUser: User,
  ): Promise<string[] | null> {
    return await this.postService.likes(new Types.ObjectId(postId), currentUser);
  }

  @Get("/query")
  async findAll(
    @Query() query: any,
  ): Promise<{ filteredPostCount: number; posts: PostType[]; limit: number }> {
    return await this.postService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostType> {
    return await this.postService.findOne(new Types.ObjectId(id));
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
