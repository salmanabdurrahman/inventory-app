import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { suppliersData } from '../data';

/**
 * Service for seeding Supplier data
 * Uses singleton pattern to ensure data is only seeded once
 */
@Injectable()
export class SupplierSeederService {
  private readonly logger = new Logger(SupplierSeederService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  /**
   * Seed supplier data to database
   * Uses upsert pattern - only insert if not exists
   * @returns Array of created suppliers
   */
  async seed(): Promise<Supplier[]> {
    const createdSuppliers: Supplier[] = [];

    for (const supplierData of suppliersData) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: { name: supplierData.name },
      });

      if (!existingSupplier) {
        const supplier = this.supplierRepository.create({
          name: supplierData.name,
          phone: supplierData.phone,
          email: supplierData.email,
          address: supplierData.address,
        });

        const savedSupplier = await this.supplierRepository.save(supplier);
        createdSuppliers.push(savedSupplier);
        this.logger.log(`Created supplier: ${supplierData.name}`);
      } else {
        createdSuppliers.push(existingSupplier);
        this.logger.debug(`Supplier already exists: ${supplierData.name}`);
      }
    }

    this.logger.log(
      `Supplier seeding completed. Created: ${createdSuppliers.filter((s) => s).length} suppliers`,
    );

    return createdSuppliers;
  }

  /**
   * Get all suppliers in the order they were seeded
   * Useful for item seeder to reference suppliers by index
   */
  async getSuppliersInOrder(): Promise<Supplier[]> {
    const suppliers: Supplier[] = [];

    for (const supplierData of suppliersData) {
      const supplier = await this.supplierRepository.findOne({
        where: { name: supplierData.name },
      });
      if (supplier) {
        suppliers.push(supplier);
      }
    }

    return suppliers;
  }
}
