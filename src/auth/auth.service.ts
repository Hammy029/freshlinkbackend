import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './entities/auth.schema';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private jwtService: JwtService,
  ) {}

  // =========================
  // REGISTER USER
  // =========================
  async register(registerDto: RegisterDto) {
    try {
      console.log('================ REGISTER HIT ================');
      console.log(registerDto);

      const { username, email, password, phone_no } = registerDto;

      const normalizedEmail = email.toLowerCase();

      // Check existing user
      const existingUser = await this.userModel.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = new this.userModel({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        phone_no,
        role: 'user',
      });

      console.log('NEW USER CREATED');
      console.log(newUser);

      // Save to MongoDB
      const savedUser = await newUser.save();

      console.log('============= USER SAVED SUCCESSFULLY =============');
      console.log(savedUser);

      return {
        message: 'User registered successfully',
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          phone_no: savedUser.phone_no,
          role: savedUser.role,
        },
      };
    } catch (error) {
      console.log('============= REGISTER ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // LOGIN USER
  // =========================
  async login(loginDto: LoginDto) {
    try {
      console.log('================ LOGIN HIT ================');
      console.log(loginDto);

      const { email, password } = loginDto;

      const normalizedEmail = email.toLowerCase();

      const user = await this.userModel.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload);

      console.log('LOGIN SUCCESSFUL');

      return {
        access_token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          phone_no: user.phone_no,
        },
      };
    } catch (error) {
      console.log('============= LOGIN ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // GOOGLE LOGIN
  // =========================
  async googleLogin(user: any) {
    try {
      if (!user || !user.email) {
        throw new UnauthorizedException(
          'No user data from Google',
        );
      }

      const normalizedEmail = user.email.toLowerCase();

      if (!normalizedEmail.endsWith('@gmail.com')) {
        throw new UnauthorizedException(
          'Only Gmail accounts are allowed',
        );
      }

      let existingUser = await this.userModel.findOne({
        email: normalizedEmail,
      });

      if (!existingUser) {
        existingUser = new this.userModel({
          username:
            user.displayName ||
            normalizedEmail.split('@')[0],

          email: normalizedEmail,
          password: null,
          phone_no: null,
          role: 'user',
        });

        await existingUser.save();

        console.log('NEW GOOGLE USER SAVED');
      }

      const payload = {
        sub: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        message: 'Google login successful',
        access_token,
        user: {
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
      };
    } catch (error) {
      console.log('============= GOOGLE LOGIN ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // FORGOT PASSWORD
  // =========================
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    try {
      const { email } = forgotPasswordDto;

      const normalizedEmail = email.toLowerCase();

      const user = await this.userModel.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        return {
          message:
            'If that email exists, a reset link has been sent',
        };
      }

      const payload = {
        sub: user._id,
        email: user.email,
      };

      const resetToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      const resetLink =
        `http://localhost:4200/reset-password?token=${resetToken}`;

      console.log('RESET LINK');
      console.log(resetLink);

      return {
        message:
          'If that email exists, a reset link has been sent',
      };
    } catch (error) {
      console.log('============= FORGOT PASSWORD ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // RESET PASSWORD
  // =========================
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ) {
    try {
      const { token, newPassword } =
        resetPasswordDto;

      const payload = this.jwtService.verify(token);

      const userId = payload.sub;

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10,
      );

      user.password = hashedPassword;

      await user.save();

      return {
        message: 'Password reset successful',
      };
    } catch (error) {
      console.log('============= RESET PASSWORD ERROR =============');
      console.log(error);

      throw new BadRequestException(
        'Invalid or expired token',
      );
    }
  }

  // =========================
  // UPDATE PASSWORD
  // =========================
  async updatePassword(
    userId: any,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      const { currentPassword, newPassword } =
        updatePasswordDto;

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Current password is incorrect',
        );
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10,
      );

      user.password = hashedPassword;

      await user.save();

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.log('============= UPDATE PASSWORD ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // GET ALL USERS
  // =========================
  async findAll() {
    return await this.userModel.find().exec();
  }

  async findAllUsers() {
    return await this.userModel
      .find()
      .select('-password')
      .exec();
  }

  // =========================
  // UPDATE USER
  // =========================
  async update(
    id: string,
    updateAuthDto: Partial<User>,
  ) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Invalid user ID',
        );
      }

      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      Object.assign(user, updateAuthDto);

      await user.save();

      return {
        message: 'User updated successfully',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phone_no: user.phone_no,
          role: user.role,
        },
      };
    } catch (error) {
      console.log('============= UPDATE USER ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // DELETE USER
  // =========================
  async remove(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          'Invalid user ID',
        );
      }

      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userModel.findByIdAndDelete(id);

      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.log('============= DELETE USER ERROR =============');
      console.log(error);

      throw error;
    }
  }

  // =========================
  // STUB METHODS
  // =========================
  async findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async create(createAuthDto: any) {
    return 'This action adds a new auth';
  }
}