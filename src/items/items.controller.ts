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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get('create')
  @Render('items/create')
  async createPage() {
    const suppliers = await this.itemsService.getAllSuppliers();
    return { suppliers };
  }

  @Post()
  @Redirect('/items')
  async create(@Body() createItemDto: CreateItemDto) {
    await this.itemsService.create(createItemDto);
    return { url: '/items' };
  }

  @Get()
  @Render('items/index')
  async findAll() {
    const items = await this.itemsService.findAll();
    return { items };
  }

  @Get(':id/edit')
  @Render('items/edit')
  async editPage(@Param('id') id: string) {
    const item = await this.itemsService.findOne(+id);
    const suppliers = await this.itemsService.getAllSuppliers();
    return { item, suppliers };
  }

  @Post(':id/update')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Res() res: Response,
  ) {
    await this.itemsService.update(+id, updateItemDto);
    return res.redirect('/items');
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.itemsService.remove(+id);
    return res.redirect('/items');
  }
}
