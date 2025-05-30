import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farm } from './entities/farm.schema';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<Farm>) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const createdFarm = new this.farmModel(createFarmDto);
    return createdFarm.save();
  }

  async findAll(): Promise<Farm[]> {
    return this.farmModel.find().populate('category').populate('farmer').exec();
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmModel.findById(id).populate('category').populate('farmer').exec();
    if (!farm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const updatedFarm = await this.farmModel
      .findByIdAndUpdate(id, updateFarmDto, { new: true })
      .exec();
    if (!updatedFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return updatedFarm;
  }

  async remove(id: string): Promise<Farm> {
    const deletedFarm = await this.farmModel.findByIdAndDelete(id).exec();
    if (!deletedFarm) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }
    return deletedFarm;
  }
}
