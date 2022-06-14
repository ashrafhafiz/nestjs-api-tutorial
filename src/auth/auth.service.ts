import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signin(body: AuthDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: body.email },
    });
    if (!user) {
      throw new ForbiddenException(`Invalid credentials`);
    }
    const passwordMatch = await argon.verify(
      user.hashedPassword,
      body.password,
    );
    if (!passwordMatch) {
      throw new ForbiddenException(`Invalid credentials`);
    }
    const token = await this.jwtSignToken(user.id, user.email);
    return { ...user, token };
  }

  async signup(body: AuthDto) {
    const userExists = await this.prismaService.user.findFirst({
      where: { email: body.email },
    });
    if (userExists) {
      throw new ForbiddenException(`User does exist! Please sign in`);
      return;
    }
    // create hashed password
    const hashedPassword = await argon.hash(body.password);
    // store user in database
    const user = await this.prismaService.user.create({
      data: { email: body.email, hashedPassword },
    });
    const token = await this.jwtSignToken(user.id, user.email);
    return { ...user, token };
  }

  async jwtSignToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
