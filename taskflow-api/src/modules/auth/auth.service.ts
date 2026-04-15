import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  private readonly refreshTokens = new Set<string>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user);
    
    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refresh(refreshDto: RefreshDto) {
    try {
      const payload = this.jwtService.verify(refreshDto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      if (!this.refreshTokens.has(refreshDto.refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      this.refreshTokens.delete(refreshDto.refreshToken);
      const tokens = await this.generateTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async generateTokens(user: Omit<User, 'password'>) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

  const jwtSecret = this.configService.get<string>('jwt.secret') ?? 'secret';
  const jwtExpiresIn = this.configService.get('jwt.expiresIn') ?? '1h';
  const refreshSecret = this.configService.get<string>('jwt.refreshSecret') ?? 'refresh_secret';
  const refreshExpiresIn = this.configService.get('jwt.refreshExpiresIn') ?? '7d';

  const accessToken = this.jwtService.sign(payload, {
    secret: jwtSecret,
    expiresIn: jwtExpiresIn,
  });

  const refreshToken = this.jwtService.sign(payload, {
    secret: refreshSecret,
    expiresIn: refreshExpiresIn,
  });

  this.refreshTokens.add(refreshToken);

  return {
    accessToken,
    refreshToken,
  };
}

  async removeRefreshToken(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
  }
}
