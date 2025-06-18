import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farm } from './entities/farm.schema';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<Farm>) {}

  // ✅ CREATE farm product and attach owner (farm = user ID)
  async create(createFarmDto: CreateFarmDto & { farm: string }): Promise<Farm> {
    const createdFarm = new this.farmModel(createFarmDto);
    return createdFarm.save();
  }

  // ✅ ADMIN: Get all farm products
  async findAll(): Promise<Farm[]> {
    return this.farmModel
      .find()
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();
  }

  // ✅ RAW ALL: For /farm/raw-all route
  async getRawAllFarms(): Promise<Farm[]> {
    return this.findAll();
  }

  // ✅ ADMIN ALIAS for Angular Service
  async getAllFarmsAsAdmin(): Promise<Farm[]> {
    return this.findAll();
  }

  // ✅ PUBLIC: Get only available products (not sold)
  async findAllPublic(): Promise<Farm[]> {
    return this.farmModel
      .find({ status: { $ne: 'Sold' } })
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();
  }

  // ✅ Optional alias for Angular call
  async getAvailableProductsPublic(): Promise<Farm[]> {
    return this.findAllPublic();
  }

  // ✅ SINGLE PRODUCT by ID
  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmModel
      .findById(id)
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  // ✅ USER: Get products by logged-in user
  async findByUser(userId: string): Promise<Farm[]> {
    return this.farmModel
      .find({ farm: userId })
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();
  }

  // ✅ UPDATE: Owner or Admin
  async update(
    id: string,
    updateFarmDto: UpdateFarmDto,
    user: any,
  ): Promise<Farm> {
    const farm = await this.farmModel.findById(id);
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    if (String(farm.farm) !== String(user._id) && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const updatedFarm = await this.farmModel
      .findByIdAndUpdate(id, updateFarmDto, { new: true })
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();

    if (!updatedFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    return updatedFarm;
  }

  // ✅ DELETE: Owner or Admin
  async remove(id: string, user: any): Promise<Farm> {
    const farm = await this.farmModel.findById(id);
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    if (String(farm.farm) !== String(user._id) && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const deleted = await this.farmModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    return deleted;
  }

  // ✅ MARK AS SOLD
  async markAsSold(id: string): Promise<Farm> {
    const updated = await this.farmModel
      .findByIdAndUpdate(id, { status: 'Sold' }, { new: true })
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Farm product with ID ${id} not found`);
    }

    return updated;
  }

  // ✅ NEW: Search by Product ID and get poster's contact
  async findProductWithOwner(id: string): Promise<Farm> {
    const product = await this.farmModel
      .findById(id)
      .populate('category')
      .populate({
        path: 'farm',
        select: 'username email phone_no',
      })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
