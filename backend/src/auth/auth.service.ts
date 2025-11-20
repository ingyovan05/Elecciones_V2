
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !user.isActive) {
      return null;
    }
    if (user.isBlocked) {
      throw new ForbiddenException('Usuario bloqueado. Contacte a un administrador.');
    }
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      await this.usersService.incrementFailedAttempts(user.id);
      if (user.failedAttempts + 1 >= 3) {
        throw new ForbiddenException('Cuenta bloqueada por intentos fallidos.');
      }
      return null;
    }
    await this.usersService.resetFailedAttempts(user.id);
    return user;
  }

  async login(credentials: LoginDto) {
    const user = await this.validateUser(credentials.username, credentials.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token, user: payload };
  }
}
