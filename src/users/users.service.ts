import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  InvalidCredentialsException,
} from '../common/exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user: ${createUserDto.email}`);

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new EntityAlreadyExistsException('User', 'email');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created successfully with ID: ${savedUser.id}`);
    return savedUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.log(`Validating user: ${email}`);

    const user = await this.findByEmail(email);

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new InvalidCredentialsException();
    }

    this.logger.log(`User validated successfully: ${email}`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    this.logger.log(`User updated successfully: ${id}`);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    this.logger.log(`Deleting user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new EntityNotFoundException('User', id);
    }

    await this.userRepository.delete(id);
    this.logger.log(`User deleted successfully: ${id}`);
    return { deleted: true, id };
  }
}
