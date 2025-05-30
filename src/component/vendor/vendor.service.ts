import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor, VendorDocument } from './entities/vendor.schema';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const createdVendor = new this.vendorModel(createVendorDto);
    return createdVendor.save();
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.find().exec();
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findById(id).exec();
    if (!vendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const updatedVendor = await this.vendorModel.findByIdAndUpdate(
      id,
      updateVendorDto,
      { new: true },
    ).exec();

    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    return updatedVendor;
  }

  async remove(id: string): Promise<Vendor> {
    const deletedVendor = await this.vendorModel.findByIdAndDelete(id).exec();
    if (!deletedVendor) {
      throw new NotFoundException(`Vendor with id ${id} not found`);
    }
    return deletedVendor;
  }
}
