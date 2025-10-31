import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/createMeal.dto';
import { JwtService } from '@nestjs/jwt';
import { upateMealDto } from './dto/upateMeal.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'meals',
  version: '1',
})
export class MealsController {
  constructor(
    private readonly mealsService: MealsService,
    private readonly JwtService: JwtService,
  ) {}

  @Post()
  async createMeal(@Body() CreateMealDto: CreateMealDto, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.mealsService.createMeal(CreateMealDto, data.id);
  }

  @Patch()
  async updateMeal(@Body() upateMealDto: upateMealDto, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.mealsService.updateMeal(upateMealDto, data.id);
  }

  @Delete()
  async deleteMeal(@Query() query, @Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.mealsService.deleteMeal(query.mealsId, data.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadForRole(@UploadedFile() file) {
    return {
      msg: '上传成功',
      data: {
        url: `http://127.0.0.1:8311/image/${file.filename}`,
      },
    };
  }
}
