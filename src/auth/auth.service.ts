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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, phone_no } = registerDto;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await this.userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      email: normalizedEmail,
      phone_no,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();
    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const normalizedEmail = email.toLowerCase();

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

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
  }

  async googleLogin(user: any) {
    if (!user || !user.email) {
      throw new UnauthorizedException('No user data from Google');
    }

    const normalizedEmail = user.email.toLowerCase();
    if (!normalizedEmail.endsWith('@gmail.com')) {
      throw new UnauthorizedException('Only Gmail accounts are allowed');
    }

    let existingUser = await this.userModel.findOne({ email: normalizedEmail });

    if (!existingUser) {
      existingUser = new this.userModel({
        username: user.displayName || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: null,
        phone_no: null,
        role: 'user',
      });

      await existingUser.save();
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
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    if (typeof email !== 'string') {
      throw new BadRequestException('Email must be a valid string');
    }

    const normalizedEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return { message: 'If that email exists, a reset link has been sent' };
    }

    const payload = { sub: user._id, email: user.email };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
    console.log(`🔗 Simulated Reset Link (send via email): ${resetLink}`);

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password reset successful' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async updatePassword(userId: any, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findAllUsers() {
    return await this.userModel.find().select('-password').exec();
  }

  async update(id: string, updateAuthDto: Partial<User>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
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
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndDelete(id);
    return { message: 'User deleted successfully' };
  }

  async findOne(id: number) {
    return `This action returns a #${id} auth (stub)`;
  }

  async create(createAuthDto: any) {
    return 'This action adds a new auth (you may remove this)';
  }
}
