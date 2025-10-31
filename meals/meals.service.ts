import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMealDto } from './dto/createMeal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
import { Category } from 'src/category/entities/category.entities';
import { Meals } from './entities/meal.entity';
import { upateMealDto } from './dto/upateMeal.dto';
@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleConfig)
    private readonly roleConfigRepository: Repository<RoleConfig>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Meals)
    private readonly mealsRepository: Repository<Meals>,
  ) {}

  //添加商品
  async createMeal(CreateMealDto: CreateMealDto, id: number) {
    const {
      name,
      desc,
      price,
      cost,
      inventory,
      detailImage,
      originalPrice,
      placardImage,
      categoryName,
    } = CreateMealDto;

    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (role == null) {
      throw new UnauthorizedException('登录过期，请重新登录');
    }
    const roleConfig = await this.roleConfigRepository.findOne({
      where: { role },
    });
    if (roleConfig.lv == 2) {
      throw new ForbiddenException('权限不足');
    } else {
      const category = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });
      if (category == null) {
        throw new ForbiddenException('分类不存在');
      }
      const newMeal = new Meals();
      newMeal.name = name;
      newMeal.desc = desc;
      newMeal.price = price;
      newMeal.cost = cost;
      newMeal.inventory = inventory;
      newMeal.detailImage = detailImage;
      newMeal.placardImage = placardImage;
      newMeal.originalPrice = originalPrice;
      newMeal.category = category;
      newMeal.role = role;
      newMeal.status = 1;
      newMeal.sales = 0;
      newMeal.category = category;
      const row = await this.mealsRepository.save(newMeal);
      if (row.id !== 0) {
        return '添加成功';
      } else {
        throw new BadRequestException('添加失败');
      }
    }
  }

  //修改商品信息
  async updateMeal(upateMealDto: upateMealDto, id: number) {
    const { mealId, categoryName } = upateMealDto;
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (role == null) {
      throw new UnauthorizedException('登录过期，请重新登录');
    }
    const roleConfig = await this.roleConfigRepository.findOne({
      where: { role },
    });
    if (roleConfig.lv == 2) {
      throw new ForbiddenException('权限不足');
    } else {
      const category = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });
      if (category == null) {
        throw new BadRequestException('分类不存在');
      }
      const meal = await this.mealsRepository.findOne({
        where: { id: mealId },
      });
      if (meal == null) {
        throw new BadRequestException('商品不存在');
      }
      Object.keys(upateMealDto).forEach((key) => {
        if (
          upateMealDto[key].toString() !== '' &&
          key !== 'mealId' &&
          key !== 'categoryName'
        ) {
          meal[key] = upateMealDto[key];
        }
      });
      console.log(meal);
      const row = await this.mealsRepository.update(meal.id, meal);
      if (row.affected !== 0) {
        return '修改成功';
      } else {
        return new BadRequestException('修改失败');
      }
    }
  }

  //删除商品
  async deleteMeal(mealId: number, id: number) {
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (role == null) {
      throw new UnauthorizedException('登录过期，请重新登录');
    }
    const roleConfig = await this.roleConfigRepository.findOne({
      where: { role },
    });
    if (roleConfig.lv == 2) {
      throw new ForbiddenException('权限不足');
    } else {
      const meal = await this.mealsRepository.findOne({
        where: { id: mealId },
      });
      if (meal == null) {
        throw new BadRequestException('商品不存在');
      }
      const row = await this.mealsRepository.update(mealId, { status: 0 });
      if (row.affected !== 0) {
        return '删除成功';
      } else {
        throw new BadRequestException('删除失败');
      }
    }
  }
}
