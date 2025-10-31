import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { bcryptService } from 'src/utils/bcrypt.service';
import { loginForRoleDto } from './dto/loginForRole.dto';
import { JwtService } from '@nestjs/jwt';
import { redisService } from 'src/utils/redis.service';
import { updateRolePasswordDto } from './dto/updateRolePassword.dto';
import { UpdateRoleInfoDto } from './dto/updateRoleInfo.dto';
import { RoleConfig } from 'src/roleConfig/entities/roleConfig.entity';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleConfig)
    private readonly roleConfigRepository: Repository<RoleConfig>,
    private readonly bcryptService: bcryptService,
    private readonly jwtService: JwtService,
    private readonly redisService: redisService,
  ) {}

  async roleRegister(CreateRoleDto: CreateRoleDto, sessionCode: string) {
    const { phone, password, code } = CreateRoleDto;
    if (code !== sessionCode) {
      return new BadRequestException('验证码错误');
    }
    const role = await this.roleRepository.findOne({ where: { phone: phone } });
    if (role == null) {
      const newRole = new Role();
      newRole.phone = phone;
      newRole.password = await this.bcryptService.hashEncrypt(password);
      const row = await this.roleRepository.save(newRole);
      if (row.id != 0) {
        return '注册成功';
      } else {
        return '注册失败';
      }
    } else {
      return new BadRequestException('该手机号已注册');
    }
  }
  //登录
  async roleLogin(loginForRoleDto: loginForRoleDto, sessionCode: string) {
    const { phone, password, code } = loginForRoleDto;
    if (code !== sessionCode) {
      return new BadRequestException('验证码错误');
    }
    const role = await this.roleRepository.findOne({ where: { phone: phone } });
    if (role == null) {
      return new BadRequestException('该手机号未注册');
    }
    const result = await this.bcryptService.hashCompare(
      password,
      role.password,
    );
    if (result) {
      const status = await this.roleConfigRepository.findOne({
        where: { role },
      });
      if (status.status === 0) {
        return new BadRequestException('该账号已被禁用');
      }
      const token = await this.jwtService.sign({ id: role.id, source: 'role' });
      const roleForRedis = await this.redisService.get(
        `BackgroundManagement${role.id}`,
      );
      if (roleForRedis) {
        await this.redisService.del(`BackgroundManagement${role.id}`);
      }
      await this.redisService.setex(
        `BackgroundManagement${role.id}`,
        token,
        60 * 60 * 24,
      );
      return {
        data: token,
      };
    } else {
      return new BadRequestException('密码错误');
    }
  }

  //修改密码
  async updateRolePassword(
    updateRolePasswordDto: updateRolePasswordDto,
    id: number,
  ) {
    const { oldPassword, newPassword, rePassword } = updateRolePasswordDto;
    if (oldPassword === newPassword) {
      return new BadRequestException('新密码不能与旧密码相同');
    }
    if (newPassword !== rePassword) {
      return new BadRequestException('两次密码输入不一致');
    }
    const role = await this.roleRepository.findOne({ where: { id } });
    if (role === null) {
      return new BadRequestException('登录已过期，请重新登录');
    }
    const hashPassword = role.password;
    if (await this.bcryptService.hashCompare(oldPassword, hashPassword)) {
      role.password = await this.bcryptService.hashEncrypt(newPassword);
      const row = await this.roleRepository.update(id, role);
      if (row.affected === 1) {
        return '修改成功';
      }
    } else {
      return new BadRequestException('原密码输入错误');
    }
  }
  //获取用户信息
  async getRoleInfo(id: number) {
    const user = await this.roleRepository.findOne({
      relations: ['roleConfig'],
      where: { id },
    });
    if (user === null) {
      return new BadRequestException('登录已过期，请重新登录');
    }
    return {
      id: user.id,
      phone: user.phone,
      userConfig: user.roleConfig,
    };
  }

  //修改用户信息
  async updateRoleInfo(UpdateRoleInfoDto: UpdateRoleInfoDto, id: number) {
    console.log(id);

    const { nickName, avatarUrl } = UpdateRoleInfoDto;
    console.log(avatarUrl);

    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (role === null) {
      return new BadRequestException('登录已过期，请重新登录');
    }
    const roleConfig = await this.roleConfigRepository.findOne({
      where: { role },
    });
    console.log(roleConfig);

    if (roleConfig === null) {
      const newRoleConfig = new RoleConfig();
      newRoleConfig.nickName = nickName;
      newRoleConfig.avatarUrl = avatarUrl;
      newRoleConfig.createTime = new Date();
      newRoleConfig.updateTime = new Date();
      newRoleConfig.status = 1;
      newRoleConfig.lv = 2;
      newRoleConfig.role = role;
      const row = await this.roleConfigRepository.save(newRoleConfig);
      if (row.id !== 0) {
        return '添加成功';
      }
    } else {
      roleConfig.avatarUrl = avatarUrl;
      roleConfig.nickName = nickName;
      roleConfig.updateTime = new Date();
      const row = await this.roleConfigRepository.update(
        { role: role },
        roleConfig,
      );
      console.log(row);

      if (row.affected !== 0) {
        return '修改成功';
      }
    }
  }

  //退出登录
  async loginOutForRole(id: number) {
    const result = await this.redisService.del(`BackgroundManagement${id}`);
    if (result) {
      return '退出成功';
    } else {
      return '退出失败';
    }
  }
  //注销用户
  async singOutForRole(id: number) {
    const role = await this.roleConfigRepository.findOne({
      where: { id },
    });
    if (role === null) {
      return new BadRequestException('登录已过期，请重新登录');
    } else {
      const row = await this.roleConfigRepository.update(
        { role },
        { status: 0 },
      );
      if (row.affected !== 0) {
        return '注销成功';
      } else {
        return '注销失败';
      }
    }
  }
}
