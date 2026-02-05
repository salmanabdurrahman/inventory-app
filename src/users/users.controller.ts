import { Controller, Get, Post, Body, Req, Res, Session } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('login')
  loginPage(@Session() session: Record<string, any>, @Res() res: Response) {
    // If already logged in, redirect to home
    if (session && session.user) {
      return res.redirect('/');
    }
    // Render without layout
    return res.render('users/login', { layout: false, error: null });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const user = await this.usersService.validateUser(
      body.email,
      body.password,
    );

    if (user) {
      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return res.redirect('/');
    }

    return res.render('users/login', {
      layout: false,
      error: 'Invalid email or password!',
      email: body.email,
    });
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('/users/login');
    });
  }
}
