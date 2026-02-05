import { Controller, Get, Res, Session } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  home(@Session() session: Record<string, any>, @Res() res: Response) {
    // If not logged in, redirect to login
    if (!session || !session.user) {
      return res.redirect('/users/login');
    }

    // If logged in, render dashboard
    return res.render('dashboard', { user: session.user });
  }
}
