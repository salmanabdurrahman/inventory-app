import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SupplierSeederService, ItemSeederService } from './services';

/**
 * Main Seeder Service
 * Orchestrates all seeding operations in the correct order
 */
@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly supplierSeederService: SupplierSeederService,
    private readonly itemSeederService: ItemSeederService,
  ) {}

  async onModuleInit() {
    this.logger.log('=== Starting Database Seeding ===');

    // Seed in order of dependencies
    await this.seedUsers();
    await this.supplierSeederService.seed();
    await this.itemSeederService.seed();

    this.logger.log('=== Database Seeding Completed ===');
  }

  /**
   * Seed admin user
   */
  private async seedUsers() {
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin@gudangapp.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const admin = this.userRepository.create({
        name: 'Administrator',
        email: 'admin@gudangapp.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });

      await this.userRepository.save(admin);
      this.logger.log('Created admin user');
      this.logger.log('Email: admin@gudangapp.com');
      this.logger.log('Password: admin123');
    } else {
      this.logger.debug('Admin user already exists');
    }
  }
}
