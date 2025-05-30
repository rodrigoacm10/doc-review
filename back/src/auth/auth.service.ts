import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars

      return result;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  login(user: { id: string; email: string }) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: { email: string; password: string; name: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.usersService.create({
      ...data,
      password: hashedPassword,
    });
  }
}
