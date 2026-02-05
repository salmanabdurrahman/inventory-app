import { Injectable, Logger } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Like, Repository } from 'typeorm';
import { EntityNotFoundException } from '../common/exceptions';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    this.logger.log(`Creating supplier: ${createSupplierDto.name}`);
    const supplier = await this.supplierRepository.save(createSupplierDto);
    this.logger.log(`Supplier created successfully with ID: ${supplier.id}`);
    return supplier;
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

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new EntityNotFoundException('Supplier', id);
    }

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    this.logger.log(`Updating supplier with ID: ${id}`);

    const supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new EntityNotFoundException('Supplier', id);
    }

    await this.supplierRepository.update(id, updateSupplierDto);
    this.logger.log(`Supplier updated successfully: ${id}`);
    return this.supplierRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    this.logger.log(`Deleting supplier with ID: ${id}`);

    const supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!supplier) {
      throw new EntityNotFoundException('Supplier', id);
    }

    await this.supplierRepository.delete(id);
    this.logger.log(`Supplier deleted successfully: ${id}`);
    return { deleted: true, id };
  }
}
