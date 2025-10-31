import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { createCategoryDto } from './dto/createCategory.dto';
import { JwtService } from '@nestjs/jwt';
import { updateCategoryDto } from './dto/updateCategory.dto';

@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly JwtService: JwtService,
  ) {}
  // 获取分类列表
  @Get()
  async getCategoryList() {
    return this.categoryService.getCategoryList();
  }

  //添加分类
  @Post()
  async addCategory(@Body() createCategoryDto: createCategoryDto, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.categoryService.addCategory(createCategoryDto, data.id);
  }

  @Patch()
  async updateCategory(
    @Body() updateCategoryDto: updateCategoryDto,
    @Req() req,
  ) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.categoryService.updateCategory(data.id, updateCategoryDto);
  }

  @Delete()
  async deleteCategory(@Query() query: { categoryId: number }, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.categoryService.deleteCategory(data.id, query.categoryId);
  }
}
