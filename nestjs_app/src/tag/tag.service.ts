import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './models/tag.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagModel.create(createTagDto);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find();
  }

  async findOne(id: Types.ObjectId): Promise<Tag> {
    const tag = await this.tagModel.findById(id);
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
