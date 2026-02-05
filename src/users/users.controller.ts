import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Session,
  UseGuards,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards';
import { InvalidCredentialsException } from '../common/exceptions';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

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
    try {
      const user = await this.usersService.validateUser(
        body.email,
        body.password,
      );

      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      this.logger.log(`User logged in successfully: ${user.email}`);
      return res.redirect('/');
    } catch (error) {
      // Handle invalid credentials gracefully for login page
      if (error instanceof InvalidCredentialsException) {
        this.logger.warn(`Failed login attempt for: ${body.email}`);
        return res.render('users/login', {
          layout: false,
          error: 'Invalid email or password!',
          email: body.email,
        });
      }

      // Re-throw other errors to be handled by global filter
      throw error;
    }
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: Request, @Res() res: Response) {
    const userEmail = (req.session as any)?.user?.email;

    req.session.destroy((err) => {
      if (err) {
        this.logger.error(`Session destroy error for ${userEmail}:`, err);
      } else {
        this.logger.log(`User logged out: ${userEmail}`);
      }
      res.redirect('/users/login');
    });
  }
}
