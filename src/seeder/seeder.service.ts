import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
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
      console.log('Seeder: Admin user created successfully');
      console.log(' Email: admin@gudangapp.com');
      console.log(' Password: admin123');
    } else {
      console.log('Seeder: Admin user already exists');
    }
  }
}
