import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { regUserForMiniProgramDto } from './dto/regUserForMiniProgram.dto';
import { userLoginForMiniProgramDto } from './dto/UserLoginForMiniProgram.dto';
import { userLoginForMiniProgramByphoneDto } from './dto/userLoginForMiniProgramByPhone.dto';
import { updateUserPasswordDto } from './dto/updateUserPassword.dto';
import { JwtService } from '@nestjs/jwt';
import { UserInfoForMiniProgramDto } from './dto/updateUserInfoForMiniProgram.dto';
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly JwtService: JwtService,
  ) {}
  //小程序注册
  @Post('miniProgram/register')
  creatUserForMiniProgram(
    @Body() regUserForMiniProgramDto: regUserForMiniProgramDto,
  ) {
    return this.userService.regUserOrLoginForMiniProgram(
      regUserForMiniProgramDto,
    );
  }
  //小程序账户登录
  @Post('miniProgram/login')
  loginForMiniProgram(
    @Body() userLoginForMiniProgramDto: userLoginForMiniProgramDto,
  ) {
    return this.userService.loginForMiniProgram(userLoginForMiniProgramDto);
  }
  //小程序免密登录
  @Post('miniProgram/loginByPhone')
  loginByPhoneForMiniProgram(
    @Body()
    userLoginForMiniProgramByphoneDto: userLoginForMiniProgramByphoneDto,
  ) {
    return this.userService.loginForMiniProgramByPhone(
      userLoginForMiniProgramByphoneDto,
    );
  }

  //修改密码
  @Post('miniProgram/updatePassword')
  async uploadUserPassword(
    @Body() updateUserPasswordDto: updateUserPasswordDto,
    @Req() req,
  ) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.updateUserPassword(updateUserPasswordDto, data.id);
  }
  //上传头像
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file) {
    return {
      msg: '上传成功',
      code: 200,
      url: `${file.filename}`,
    };
  }

  //获取小程序用户信息
  @Get('miniProgram/getUserInfo')
  async getUserInfoForMiniProgram(@Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.getUserInfoForMiniProgram(data.id);
  }

  //修改小程序用户信息
  @Patch('miniProgram/updateUserInfo')
  async updateUserInfoForMiniProgram(
    @Body() UserInfoForMiniProgramDto: UserInfoForMiniProgramDto,
    @Req() req,
  ) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.updateUserInfoForMiniProgram(
      UserInfoForMiniProgramDto,
      data.id,
    );
  }

  //小程序用户退出登录
  @Post('miniProgram/loginOut')
  async logoutForMiniProgram(@Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.logoutForMiniProgram(data.id);
  }
  //小程序用户注销
  @Post('miniProgram/singOut')
  async singOut(@Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.userService.singOut(data.id);
  }
}
