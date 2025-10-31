import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { addBannerDto } from './dto/addBanner.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'banner',
  version: '1',
})
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}
  @Get()
  getBanner() {
    return this.bannerService.getBanner();
  }

  @Post()
  addBanner(@Body() addBannerDto: addBannerDto) {
    return this.bannerService.addBanner(addBannerDto);
  }

  @Delete()
  delBanner(@Body() id: number) {
    return this.bannerService.delBanner(id);
  }

  @Patch()
  updateBannerSort(@Body() body: { id: number; sort: number }) {
    return this.bannerService.updateBannerSort(body);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('banner'))
  uploadBanner(@UploadedFile() banner) {
    return {
      msg: '上传成功',
      data: {
        url: `http://127.0.0.1:8311/image/${banner.filename}`,
      },
    };
  }
}
