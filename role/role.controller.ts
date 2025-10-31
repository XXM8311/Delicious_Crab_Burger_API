import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Session,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { loginForRoleDto } from './dto/loginForRole.dto';
import { updateRolePasswordDto } from './dto/updateRolePassword.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateRoleInfoDto } from './dto/updateRoleInfo.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'role',
  version: '1',
})
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly JwtService: JwtService,
  ) {}
  //注册
  @Post('register')
  async roleRegister(@Body() CreateRoleDto: CreateRoleDto, @Session() session) {
    return this.roleService.roleRegister(CreateRoleDto, session.code);
  }
  //登录
  @Post('login')
  async roleLogion(
    @Body() loginForRoleDto: loginForRoleDto,
    @Session() session,
  ) {
    return this.roleService.roleLogin(loginForRoleDto, session.code);
  }

  //修改密码
  @Post('updatePassword')
  async updateRolePassword(
    @Body() updateRolePasswordDto: updateRolePasswordDto,
    @Req() req,
  ) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.roleService.updateRolePassword(updateRolePasswordDto, data.id);
  }
  //获取角色信息
  @Get('getRoleInfo')
  getRoleInfo(@Req() req) {
    const data = this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.roleService.getRoleInfo(data.id);
  }

  //修改角色信息
  @Patch('updateRoleInfo')
  updateRoleInfo(@Body() UpdateRoleInfoDto: UpdateRoleInfoDto, @Req() req) {
    const data = this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.roleService.updateRoleInfo(UpdateRoleInfoDto, data.id);
  }
  //退出登录
  @Post('loginOut')
  async logoutForRole(@Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.roleService.loginOutForRole(data.id);
  }

  //用户注销
  @Post('singOut')
  async singOutForRole(@Req() req) {
    const data = await this.JwtService.verify(
      req.headers.authorization.split(' ')[1],
    );
    return this.roleService.singOutForRole(data.id);
  }

  //上传头像
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
