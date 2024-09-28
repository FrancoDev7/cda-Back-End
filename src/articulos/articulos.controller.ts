import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto, UpdateArticuloDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';

@Controller('articulos')
// @Auth()
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  create(
    @Body() createArticuloDto: CreateArticuloDto,
    //@GetUser() user : User
  ) {
    return this.articulosService.create(createArticuloDto);
  }

  @Get()
  findAll( 
    @Query() paginationDto: PaginationDto 
  ) {
    return this.articulosService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(
    @Param( 'term' ) term: string
  ) {
    return this.articulosService.findOnePlain( term ) ;
  }

  @Patch(':id')
  @Auth()
  update(
    @Param( 'id', ParseIntPipe ) id: number, 
    @Body() updateArticuloDto: UpdateArticuloDto,
    @GetUser() user : User
  ) {
    return this.articulosService.update(+id, updateArticuloDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id',ParseIntPipe) id: number
  ) {
    return this.articulosService.remove(+id);
  }

}
