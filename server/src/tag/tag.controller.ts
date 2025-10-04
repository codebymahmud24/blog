import { Types } from 'mongoose';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { userRoles } from 'src/utility/userRoles';
import { AuthorizeGuard } from 'src/utility/guards/authorize.guard';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { Tag } from './models/tag.model';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
    @UseGuards(AuthenticationGuard,(AuthorizeGuard([userRoles.Admin,userRoles.Auther])))
 async create(@Body() createTagDto: CreateTagDto):Promise<Tag> {
    return await this.tagService.create(createTagDto);
  }

  @Get()
  async findAll():Promise<Tag[]> {
    return await this.tagService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<Tag> {
    return await this.tagService.findOne(new Types.ObjectId(id));
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagService.update(+id, updateTagDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagService.remove(+id);
  // }
}
