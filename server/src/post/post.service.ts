import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './models/post.model';
import { Model, Types, Query } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/models/user.model';
import { PostApproveDto } from './dto/post-approve-dto';
import { ApiFeatures, QueryParams } from './utility/apiFeature';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  async create(createPostDto: CreatePostDto, currentUser: User): Promise<Post> {
    const category = await this.categoryService.findOne(
      new Types.ObjectId(createPostDto.category),
    );
    const tags: string[] = [];
    for (let i = 0; i < createPostDto.tags.length; i++) {
      const tag = await this.tagService.findOne(
        new Types.ObjectId(createPostDto.tags[i]),
      );
      tags.push(tag._id?.toString() as string);
    }
    const newPost = await this.postModel.create({
      ...createPostDto,
      category,
      tags,
      author: currentUser._id?.toString() as string,
    });
    return newPost;
  }

  async approve(postApproveDto: PostApproveDto): Promise<Post | null> {
    const post = await this.postModel.findById(postApproveDto.id);
    if (!post) throw new Error('post not found.');
    post.approved = postApproveDto.approve;
    return await post.save();
  }

  async getAllPostByAdmin(): Promise<Post[]> {
    return await this.postModel
      .find({})
      .populate('category')
      .populate('tags')
      .populate('author', '_id name avatar');
  }

async findAll(
    query: QueryParams,
  ): Promise<{ filteredPostCount: number; posts: Post[]; limit: number }> {
    // 1️⃣ ApiFeatures class দিয়ে query তৈরি
    const apiFeature = new ApiFeatures<PostDocument>(
      this.postModel.find(), // base query
      query, // query params from controller
    )
      .search()
      .filter()
      .sortByNewest()
      .approved(query.approved ? true : false)
      .pagination(query.limit ? Number(query.limit) : 10); 

    // 2️⃣ Filter হওয়া post গুলো আনো
    const posts = await apiFeature.query;

    // 3️⃣ Filter হওয়া ডকুমেন্টের সংখ্যা count করো
    const filteredPostCount = await this.postModel
      .find(apiFeature['query'].getQuery()) // same filters use করা হচ্ছে
      .countDocuments();

    // 4️⃣ Pagination limit
    const limit = Number(query.limit) || 10;

    return { filteredPostCount, posts, limit };
  }

 async findOne(id: Types.ObjectId): Promise<Post> {
    const post = await this.postModel
      .findOne({ _id: id, approved: true })
      .populate('author', '_id name avatar')
      .populate('category', '_id title')
      .populate({ path: 'tags', model: 'Tag', select: '_id title' })
      .exec();
    if (!post) throw new NotFoundException('Post not found.');
    return post;
  }

   async likes(postId: Types.ObjectId, currentUser: User): Promise<string[] | null> {
    let post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found.');
    if (
      !post.likes.includes(currentUser._id?.toString() as string) &&
      post.author !== currentUser._id?.toString()
    ) {
      post.likes.push(currentUser._id?.toString() as string);
      post.totalComments++;
      await post.save();
    }
    return post.likes.map((like) => like.toString());
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
