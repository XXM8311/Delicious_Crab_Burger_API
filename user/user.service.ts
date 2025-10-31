import { BadRequestException, Injectable } from '@nestjs/common';
import { regUserForMiniProgramDto } from './dto/regUserForMiniProgram.dto';
import { userLoginForMiniProgramDto } from './dto/UserLoginForMiniProgram.dto';
import { userLoginForMiniProgramByphoneDto } from './dto/userLoginForMiniProgramByPhone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MiniProgramUser } from './entities/UserForMiniProgram.entity';
import { Repository } from 'typeorm';
import { redisService } from './../utils/redis.service';
import { bcryptService } from './../utils/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { updateUserPasswordDto } from './dto/updateUserPassword.dto';
import { UserInfoForMiniProgramDto } from './dto/updateUserInfoForMiniProgram.dto';
import { userForMiniProgramConfig } from 'src/userConfig/entities/userForMiniProgramConfig.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(MiniProgramUser)
    private readonly MiniProgramUser: Repository<MiniProgramUser>,
    @InjectRepository(userForMiniProgramConfig)
    private readonly MiniProgramUserConfig: Repository<userForMiniProgramConfig>,
    private readonly redisService: redisService,
    private readonly bcryptService: bcryptService,
    private readonly jwtService: JwtService,
  ) {}
  //小程序用户注册
  async regUserOrLoginForMiniProgram(
    regUserForMiniProgramDto: regUserForMiniProgramDto,
  ) {
    const { phone, password, code } = regUserForMiniProgramDto;
    const user = await this.MiniProgramUser.findOne({ where: { phone } });
    if (user === null) {
      const codeForRedis = await this.redisService.get(phone);
      if (codeForRedis == code) {
        const newUser = new MiniProgramUser();
        newUser.phone = phone;
        newUser.password = await this.bcryptService.hashEncrypt(password);
        const row = await this.MiniProgramUser.save(newUser);
        if (row.id !== 0) {
          const newUserConfig = new userForMiniProgramConfig();
          newUserConfig.user = newUser;
          newUserConfig.status = 1;
          newUserConfig.nickName = '汉堡美食家';
          newUserConfig.avatarUrl = 'defaultAvatar.jpg';
          newUserConfig.gender = 0;
          newUserConfig.birthday = '';
          newUserConfig.creatTime = new Date();
          newUserConfig.updateTime = new Date();
          const row = await this.MiniProgramUserConfig.save(newUserConfig);
          if (row.id !== 0) {
            return {
              code: 200,
              message: '注册成功',
            };
          } else {
            return {
              code: 400,
              message: '注册失败',
            };
          }
        }
      } else {
        return new BadRequestException('验证码错误');
      }
    } else {
      const userConfig = await this.MiniProgramUserConfig.findOne({
        where: { user },
      });
      if (userConfig.status == 0) {
        const row = await this.MiniProgramUserConfig.update(userConfig.id, {
          status: 1,
        });
        if (row.affected !== 0) {
          return {
            code: 200,
            message: '注册成功',
          };
        }
      } else {
        return new BadRequestException('用户已注册，请登录');
      }
    }
  }
  //小程序账户登录
  async loginForMiniProgram(
    userLoginForMiniProgramDto: userLoginForMiniProgramDto,
  ) {
    const { phone, password } = userLoginForMiniProgramDto;
    const user = await this.MiniProgramUser.findOne({ where: { phone } });
    if (user === null) {
      return new BadRequestException('该手机号未注册');
    } else {
      const userConfig = await this.MiniProgramUserConfig.findOne({
        where: { user },
      });

      if (userConfig !== null && userConfig.status == 0) {
        return new BadRequestException('该账户不存在，请注册');
      }
      const result = await this.bcryptService.hashCompare(
        password,
        user.password,
      );
      if (result) {
        const token = await this.jwtService.sign({
          id: user.id,
          source: 'miniProgram',
        });
        const userForRedis = await this.redisService.get(
          `MiniProgramUser${user.id}`,
        );
        if (userForRedis) {
          await this.redisService.del(`MiniProgramUser${user.id}`);
        }
        await this.redisService.setex(
          `MiniProgramUser${user.id}`,
          token,
          60 * 60 * 24,
        );
        return { code: 200, token: token };
      } else {
        return new BadRequestException('密码输入错误');
      }
    }
  }

  //小程序免密登录
  async loginForMiniProgramByPhone(
    userLoginForMiniProgramByphoneDto: userLoginForMiniProgramByphoneDto,
  ) {
    const { phone, code } = userLoginForMiniProgramByphoneDto;
    const user = await this.MiniProgramUser.findOne({ where: { phone } });
    if (user === null) {
      return new BadRequestException('该手机号未注册');
    } else {
      const codeForRedis = await this.redisService.get(phone);
      if (codeForRedis == code) {
        const userConfig = await this.MiniProgramUserConfig.findOne({
          where: { user },
        });
        if (userConfig !== null && userConfig.status == 0) {
          return new BadRequestException('该账户已被禁用');
        }
        const token = await this.jwtService.sign({
          id: user.id,
          source: 'miniProgram',
        });
        const userForRedis = await this.redisService.get(
          `MiniProgramUser${user.id}`,
        );
        if (userForRedis) {
          await this.redisService.del(`MiniProgramUser${user.id}`);
        }
        await this.redisService.setex(
          `MiniProgramUser${user.id}`,
          token,
          60 * 60 * 24,
        );
        return { code: 200, token: token };
      } else {
        return new BadRequestException('验证码错误');
      }
    }
  }

  //修改密码
  async updateUserPassword(
    updateUserPasswordDto: updateUserPasswordDto,
    id: number,
  ) {
    const { oldPassword, newPassword, rePassword } = updateUserPasswordDto;
    if (oldPassword === newPassword) {
      return new BadRequestException('新密码不能与旧密码相同');
    }
    if (newPassword !== rePassword) {
      return new BadRequestException('两次密码输入不一致');
    }
    const user = await this.MiniProgramUser.findOne({ where: { id } });
    if (user === null) {
      return new BadRequestException('登录已过期，请重新登录');
    }
    const hashPassword = user.password;
    if (await this.bcryptService.hashCompare(oldPassword, hashPassword)) {
      user.password = await this.bcryptService.hashEncrypt(newPassword);
      const row = await this.MiniProgramUser.update(id, user);
      if (row.affected === 1) {
        return {
          code: 200,
          data: '修改成功',
        };
      }
    } else {
      return new BadRequestException('原密码输入错误');
    }
  }
  //获取用户信息
  async getUserInfoForMiniProgram(id: number) {
    const user = await this.MiniProgramUser.findOne({
      relations: ['userConfig'],
      where: { id },
    });
    if (user === null) {
      return new BadRequestException('登录已过期，请重新登录');
    }
    return {
      id: user.id,
      phone: user.phone,
      userConfig: user.userConfig,
    };
  }

  //修改用户信息
  async updateUserInfoForMiniProgram(
    UserInfoForMiniProgramDto: UserInfoForMiniProgramDto,
    id: number,
  ) {
    const { nickName, avatarUrl, gender, birthday } = UserInfoForMiniProgramDto;
    const user = await this.MiniProgramUser.findOne({
      where: { id },
    });
    if (user === null) {
      return new BadRequestException('登录已过期，请重新登录');
    }
    const userConfig = await this.MiniProgramUserConfig.findOne({
      where: { user },
    });
    if (userConfig === null) {
      const newUserConfig = new userForMiniProgramConfig();
      newUserConfig.nickName = nickName;
      newUserConfig.avatarUrl = avatarUrl;
      newUserConfig.gender = gender;
      newUserConfig.birthday = birthday;
      newUserConfig.creatTime = new Date();
      newUserConfig.updateTime = new Date();
      newUserConfig.status = 1;
      newUserConfig.user = user;
      const row = await this.MiniProgramUserConfig.save(newUserConfig);
      if (row.id !== 0) {
        return {
          code: 200,
          data: '修改成功',
        };
      }
    } else {
      userConfig.nickName = nickName;
      userConfig.avatarUrl = avatarUrl;
      userConfig.gender = gender;
      userConfig.birthday = birthday;
      userConfig.updateTime = new Date();
      const row = await this.MiniProgramUserConfig.update(
        { user: user },
        userConfig,
      );
      if (row.affected !== 0) {
        return {
          code: 200,
          data: '修改成功',
        };
      }
    }
  }

  //退出登录
  async logoutForMiniProgram(id: number) {
    const result = await this.redisService.del(`MiniProgramUser${id}`);
    if (result) {
      return {
        code: 200,
        data: '退出成功',
      };
    } else {
      return new BadRequestException('退出失败');
    }
  }
  //注销用户
  async singOut(id: number) {
    const user = await this.MiniProgramUser.findOne({
      where: { id },
    });
    if (user === null) {
      return new BadRequestException('登录已过期，请重新登录');
    } else {
      const row = await this.MiniProgramUserConfig.update(
        { user },
        { status: 0 },
      );
      console.log(row);
      if (row.affected !== 0) {
        return {
          code: 200,
          data: '注销成功',
        };
      } else {
        return new BadRequestException('注销失败');
      }
    }
  }
}
