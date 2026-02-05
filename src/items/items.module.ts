import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Supplier])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
