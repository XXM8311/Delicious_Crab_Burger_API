import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entities';
import { Repository } from 'typeorm';
import { createCategoryDto } from './dto/createCategory.dto';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
import { Role } from 'src/role/entities/role.entity';
import { updateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(RoleConfig)
    private readonly roleConfigRepository: Repository<RoleConfig>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  //获取分类及其分类下菜品数据
  async getCategoryList() {
    const data = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.meals', 'meal')
      .where('meal.status = :status', { status: 1 })
      .getMany();

    return {
      code: 200,
      data,
    };
  }

  //添加商品分类
  async addCategory(createCategoryDto: createCategoryDto, id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (role == null) {
      throw new UnauthorizedException('登录过期，请重新登录');
    }
    const roleConfig = await this.roleConfigRepository.findOne({
      where: { role },
    });
    if (roleConfig.lv == 2) {
      throw new ForbiddenException('权限不足');
    } else {
      const { name } = createCategoryDto;
      const category = await this.categoryRepository.findOne({
        where: { role, name: name },
      });
      if (category == null) {
        const newCategory = new Category();
        newCategory.name = name;
        newCategory.createTime = new Date();
        newCategory.updateTime = new Date();
        newCategory.status = 1;
        newCategory.role = role;
        const row = await this.categoryRepository.save(newCategory);
        if (row.id !== 0) {
          return '添加成功';
        } else {
          return '添加失败，稍后重试';
        }
      } else {
        throw new BadRequestException('分类已存在');
      }
    }
  }
  //修改分类名称
  async updateCategory(id: number, updateCategoryDto: updateCategoryDto) {
    const { name, categoryId } = updateCategoryDto;
    const role = await this.roleRepository.findOne({ where: { id } });
    if (role == null) {
      throw new UnauthorizedException('登录过期，请重新登录');
    }
    const roleConfig = await this.roleConfigRepository.findOne({
      where: { role, status: 1 },
    });
    if (roleConfig.lv == 2) {
      throw new ForbiddenException('权限不足');
    } else {
      const category = await this.categoryRepository.findOne({
        where: { role, id: categoryId },
      });
      if (category !== null) {
        category.name = name;
        category.updateTime = new Date();
        const row = await this.categoryRepository.update(category.id, category);
        if (row.affected == 1) {
          return '修改成功';
        } else {
          return '修改失败，稍后重试';
        }
      } else {
        throw new ForbiddenException('分类不存在');
      }
    }
  }

  //删除分类
  async deleteCategory(id: number, categoryId: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
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
        where: { role, status: 1, id: categoryId },
      });
      if (category !== null) {
        category.updateTime = new Date();
        category.status = 0;
        const row = await this.categoryRepository.update(category.id, category);
        if (row.affected == 1) {
          return '删除成功';
        } else {
          return '删除成功';
        }
      } else {
        throw new ForbiddenException('分类不存在');
      }
    }
  }
}
