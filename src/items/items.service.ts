import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { EntityNotFoundException } from '../common/exceptions';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    this.logger.log(`Creating item: ${createItemDto.name}`);

    let supplier: Supplier | null = null;

    if (createItemDto.supplierId) {
      supplier = await this.supplierRepository.findOne({
        where: { id: createItemDto.supplierId },
      });

      if (!supplier) {
        throw new EntityNotFoundException('Supplier', createItemDto.supplierId);
      }
    }

    const item = this.itemRepository.create({
      name: createItemDto.name,
      stock: createItemDto.stock,
      price: createItemDto.price,
    });

    if (supplier) {
      item.supplier = supplier;
    }

    const savedItem = await this.itemRepository.save(item);
    this.logger.log(`Item created successfully with ID: ${savedItem.id}`);
    return savedItem;
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

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!item) {
      throw new EntityNotFoundException('Item', id);
    }

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    this.logger.log(`Updating item with ID: ${id}`);

    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!item) {
      throw new EntityNotFoundException('Item', id);
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

      if (!supplier) {
        throw new EntityNotFoundException('Supplier', updateItemDto.supplierId);
      }

      item.supplier = supplier;
    }

    const updatedItem = await this.itemRepository.save(item);
    this.logger.log(`Item updated successfully: ${updatedItem.id}`);
    return updatedItem;
  }

  async remove(id: number) {
    this.logger.log(`Deleting item with ID: ${id}`);

    const item = await this.itemRepository.findOne({ where: { id } });

    if (!item) {
      throw new EntityNotFoundException('Item', id);
    }

    await this.itemRepository.delete(id);
    this.logger.log(`Item deleted successfully: ${id}`);
    return { deleted: true, id };
  }

  async getAllSuppliers() {
    return this.supplierRepository.find();
  }
}
