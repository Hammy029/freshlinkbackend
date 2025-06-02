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

  // Create farm product and attach owner (farm = user ID)
  async create(createFarmDto: CreateFarmDto & { farm: string }): Promise<Farm> {
    const createdFarm = new this.farmModel(createFarmDto);
    return createdFarm.save();
  }

  // Get all farm products (Admin use)
  async findAll(): Promise<Farm[]> {
    return this.farmModel.find().populate('category').populate('farm').exec();
  }

  // New: Get all available farm products (status != 'Sold') for public UI
  async findAllPublic(): Promise<Farm[]> {
    return this.farmModel
      .find({ status: { $ne: 'Sold' } })
      .populate('category')
      .populate('farm')
      .exec();
  }

  // Get a single farm product by ID
  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmModel
      .findById(id)
      .populate('category')
      .populate('farm')
      .exec();
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  // Get farm products by the currently logged-in user
  async findByUser(userId: string): Promise<Farm[]> {
    return this.farmModel
      .find({ farm: userId })
      .populate('category')
      .populate('farm')
      .exec();
  }

  // Update a farm product only if owner or admin
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
      .populate('farm')
      .exec();

    if (!updatedFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    return updatedFarm;
  }

  // Delete only if owner or admin
  async remove(id: string, user: any): Promise<Farm> {
    const farm = await this.farmModel.findById(id);
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    if (String(farm.farm) !== String(user._id) && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const deletedFarm = await this.farmModel.findByIdAndDelete(id).exec();
    if (!deletedFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return deletedFarm;
  }

  // Mark product as sold
  async markAsSold(id: string): Promise<Farm> {
    const updated = await this.farmModel
      .findByIdAndUpdate(id, { status: 'Sold' }, { new: true })
      .populate('category')
      .populate('farm')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Farm product with ID ${id} not found`);
    }

    return updated;
  }
}
