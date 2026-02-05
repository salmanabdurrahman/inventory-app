import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const supplier = await this.supplierRepository.findOne({
      where: { id: createItemDto.supplierId },
    });

    const item = this.itemRepository.create({
      name: createItemDto.name,
      stock: createItemDto.stock,
      price: createItemDto.price,
    });

    if (supplier) {
      item.supplier = supplier;
    }

    return this.itemRepository.save(item);
  }

  findAll(search?: string) {
    if (search) {
      return this.itemRepository.find({
        where: { name: Like(`%${search}%`) },
        relations: ['supplier'],
      });
    }
    return this.itemRepository.find({ relations: ['supplier'] });
  }

  findOne(id: number) {
    return this.itemRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!item) {
      return null;
    }

    // Update basic fields
    item.name = updateItemDto.name ?? item.name;
    item.stock = updateItemDto.stock ?? item.stock;
    item.price = updateItemDto.price ?? item.price;

    // Handle supplier relation if supplierId is provided
    if (updateItemDto.supplierId) {
      const supplier = await this.supplierRepository.findOne({
        where: { id: updateItemDto.supplierId },
      });

      if (supplier) {
        item.supplier = supplier;
      }
    }

    return this.itemRepository.save(item);
  }

  remove(id: number) {
    return this.itemRepository.delete(id);
  }

  async getAllSuppliers() {
    return this.supplierRepository.find();
  }
}
