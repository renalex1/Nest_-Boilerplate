import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { ConfirmUserInput } from './dto/confirm-user.input';
import { LoginUserInput } from './dto/login-user.input';
import Ctx from '@/types/context.typ';
import { JwtService } from '@/jwt/jwt.service';
import { CookieOptions } from 'express';

@Injectable()
export class UserService {
  private readonly cookieOptions: CookieOptions = {
    domain: 'localhost', // Change to your client domain
    secure: false, // Should be true if not in development
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  };

  private readonly jwtService: JwtService;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    jwtService: JwtService, // Inject JwtService in the constructor
  ) {
    this.jwtService = jwtService;
  }

  async createUser(input: CreateUserInput) {
    const confirmToken = uuidv4();
    return this.userModel.create({ ...input, confirmToken });
  }

  async confirmUser({ email, confirmToken }: ConfirmUserInput) {
    const user = await this.userModel.findOne({ email });

    if (!user || confirmToken !== user.confirmToken) {
      throw new Error('Email or confirm token are incorrect');
    }

    user.active = true;
    await user.save();

    return user;
  }

  async login({ email, password }: LoginUserInput, context: Ctx) {
    const user = await this.userModel
      .findOne({ email })
      .select('-__v -confirmToken');

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.active) {
      throw new Error('Please confirm your email address');
    }

    const jwt = this.jwtService.generateToken(
      omit(user.toJSON(), ['password', 'active']),
    );
    context.res.cookie('token', jwt, this.cookieOptions);

    return user;
  }

  async logout(context: Ctx) {
    context.res.cookie('token', '', { ...this.cookieOptions, maxAge: 0 });
    return null;
  }
}
