import { Types } from 'mongoose';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorize.guard';
import { userRoles } from 'src/utility/userRoles';
import { Category } from './models/category.model';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
    @UseGuards(AuthenticationGuard,AuthorizeGuard([userRoles.Admin]))
  async create(@Body() createCategoryDto: CreateCategoryDto) :Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

 @Get()
  async findAll():Promise<Category[]> {
    return await this.categoryService.findAll();
  }

 @Get(':id')
  async findOne(@Param('id') id: string):Promise<Category> {
    return await this.categoryService.findOne(new Types.ObjectId(id));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.remove(+id);
  // }
}
