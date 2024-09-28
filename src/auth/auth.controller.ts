import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, HttpCode, HttpStatus, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ValidRoles } from './interfaces';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login( loginUserDto );
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User 
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('users')
  getUsers(
    @Query() paginationDto: PaginationDto
  ) {
    return this.authService.findAll(paginationDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute( 
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
    return {
      user,
      userEmail,
      rawHeaders
    }
  }

  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.superUser, ValidRoles.admin )
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      user
    }
  }



}
