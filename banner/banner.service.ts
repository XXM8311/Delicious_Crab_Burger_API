import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { addBannerDto } from './dto/addBanner.dto';
@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(banner)
    private readonly banner: Repository<banner>,
  ) {}
  //获取广告轮播图
  async getBanner() {
    const bannerList = await this.banner.find({
      order: {
        sort: 'ASC',
      },
      where: { status: 1 },
    });
    return {
      code: 200,
      data: bannerList,
    };
  }

  //添加广告轮播图
  async addBanner(addBannerDto: addBannerDto) {
    const exestBanner = await this.banner.findOne({
      where: { name: addBannerDto.name },
    });
    if (exestBanner) {
      return new BadRequestException('该轮播图已存在');
    } else {
      const total = await this.banner.count();
      const { url, name } = addBannerDto;
      const newBanner = new banner();
      newBanner.url = url;
      newBanner.name = name;
      newBanner.status = 1;
      newBanner.sort = total + 1;
      const row = await this.banner.save(newBanner);
      if (row.id != 0) {
        return '添加成功';
      } else {
        return '添加失败,请重新添加';
      }
    }
  }

  //删除广告轮播图
  async delBanner(id: number) {
    const row = await this.banner.update(id, { status: 0 });
    if (row.affected != 0) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  //修改广告轮播图顺序
  async updateBannerSort(body) {
    const { id, sort } = body;

    const row = await this.banner.update(id, { sort: sort });
    if (row.affected != 0) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }
}
