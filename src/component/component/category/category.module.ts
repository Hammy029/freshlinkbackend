import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './entities/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema }
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule] // Optional: if other modules need this
})
export class CategoryModule {}
