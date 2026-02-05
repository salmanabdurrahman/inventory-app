import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  create(createSupplierDto: CreateSupplierDto) {
    return this.supplierRepository.save(createSupplierDto);
  }

  findAll(search?: string) {
    if (search) {
      return this.supplierRepository.find({
        where: [
          { name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { phone: Like(`%${search}%`) },
          { address: Like(`%${search}%`) },
        ],
      });
    }
    return this.supplierRepository.find();
  }

  findOne(id: number) {
    return this.supplierRepository.findOne({ where: { id } });
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return this.supplierRepository.update(id, updateSupplierDto);
  }

  remove(id: number) {
    return this.supplierRepository.delete(id);
  }
}
