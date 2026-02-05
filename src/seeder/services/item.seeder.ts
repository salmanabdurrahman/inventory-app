import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { itemsData } from '../data';
import { SupplierSeederService } from './supplier.seeder';

/**
 * Service untuk seeding data Item
 * Membutuhkan SupplierSeederService untuk relasi item-supplier
 */
@Injectable()
export class ItemSeederService {
  private readonly logger = new Logger(ItemSeederService.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly supplierSeederService: SupplierSeederService,
  ) {}

  /**
   * Seed data item ke database
   * Membutuhkan suppliers yang sudah di-seed terlebih dahulu
   * @returns Array of created items
   */
  async seed(): Promise<Item[]> {
    // Get suppliers in seeding order to match supplierIndex
    const suppliers = await this.supplierSeederService.getSuppliersInOrder();

    if (suppliers.length === 0) {
      this.logger.warn('⚠ No suppliers found. Please seed suppliers first.');
      return [];
    }

    const createdItems: Item[] = [];

    for (const itemData of itemsData) {
      const supplier: Supplier | undefined = suppliers[itemData.supplierIndex];

      if (!supplier) {
        this.logger.warn(
          `⚠ Supplier with index ${itemData.supplierIndex} not found for item: ${itemData.name}`,
        );
        continue;
      }

      // Check if item already exists (by name and supplier)
      const existingItem = await this.itemRepository.findOne({
        where: {
          name: itemData.name,
          supplier: { id: supplier.id },
        },
        relations: ['supplier'],
      });

      if (!existingItem) {
        const item = this.itemRepository.create({
          name: itemData.name,
          stock: itemData.stock,
          price: itemData.price,
          supplier: supplier,
        });

        const savedItem = await this.itemRepository.save(item);
        createdItems.push(savedItem);
        this.logger.log(
          `✓ Created item: ${itemData.name} (Supplier: ${supplier.name})`,
        );
      } else {
        this.logger.debug(`⊘ Item already exists: ${itemData.name}`);
      }
    }

    this.logger.log(
      `Item seeding completed. Created: ${createdItems.length} items`,
    );

    return createdItems;
  }
}
