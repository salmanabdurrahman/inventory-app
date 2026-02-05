import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Render,
  Redirect,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { type Response } from 'express';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from '../common/guards';

@Controller('suppliers')
@UseGuards(AuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get('create')
  @Render('suppliers/create')
  createPage(@Session() session: Record<string, any>) {
    return { user: session?.user };
  }

  @Post()
  @Redirect('/suppliers')
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    await this.suppliersService.create(createSupplierDto);
    return { url: '/suppliers' };
  }

  @Get()
  @Render('suppliers/index')
  async findAll(
    @Query('search') search: string,
    @Session() session: Record<string, any>,
  ) {
    const suppliers = await this.suppliersService.findAll(search);
    return { suppliers, user: session?.user, search };
  }

  @Get(':id/edit')
  @Render('suppliers/edit')
  async editPage(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const supplier = await this.suppliersService.findOne(+id);
    return { supplier, user: session?.user };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    await this.suppliersService.update(+id, updateSupplierDto);
    return res.redirect('/suppliers');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.suppliersService.remove(+id);
    return res.redirect('/suppliers');
  }
}
