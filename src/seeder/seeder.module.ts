import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { SupplierSeederService, ItemSeederService } from './services';
import { User } from '../users/entities/user.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Item } from '../items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Supplier, Item])],
  providers: [SeederService, SupplierSeederService, ItemSeederService],
})
export class SeederModule {}
