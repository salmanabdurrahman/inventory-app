import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Render,
  Redirect,
  Res,
  Session,
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
  async createPage(@Session() session: Record<string, any>) {
    const suppliers = await this.itemsService.getAllSuppliers();
    return { suppliers, user: session?.user };
  }

  @Post()
  @Redirect('/items')
  async create(@Body() createItemDto: CreateItemDto) {
    await this.itemsService.create(createItemDto);
    return { url: '/items' };
  }

  @Get()
  @Render('items/index')
  async findAll(@Session() session: Record<string, any>) {
    const items = await this.itemsService.findAll();
    return { items, user: session?.user };
  }

  @Get(':id/edit')
  @Render('items/edit')
  async editPage(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const item = await this.itemsService.findOne(+id);
    const suppliers = await this.itemsService.getAllSuppliers();
    return { item, suppliers, user: session?.user };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Res() res: Response,
  ) {
    await this.itemsService.update(+id, updateItemDto);
    return res.redirect('/items');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.itemsService.remove(+id);
    return res.redirect('/items');
  }
}
