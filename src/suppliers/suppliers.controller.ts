import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get('create')
  @Render('suppliers/create')
  createPage() {
    return {};
  }

  @Post()
  @Redirect('/suppliers')
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    await this.suppliersService.create(createSupplierDto);
    return { url: '/suppliers' };
  }

  @Get()
  @Render('suppliers/index')
  async findAll() {
    const suppliers = await this.suppliersService.findAll();
    return { suppliers };
  }

  @Get(':id/edit')
  @Render('suppliers/edit')
  async editPage(@Param('id') id: string) {
    const supplier = await this.suppliersService.findOne(+id);
    return { supplier };
  }

  @Post(':id/update')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @Res() res: Response,
  ) {
    await this.suppliersService.update(+id, updateSupplierDto);
    return res.redirect('/suppliers');
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.suppliersService.remove(+id);
    return res.redirect('/suppliers');
  }
}
