import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto, UpdateArticuloDto } from './dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  create(
    @Body() createArticuloDto: CreateArticuloDto
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
    return this.articulosService.findOne( term ) ;
  }

  @Patch(':id')
  update(
    @Param( 'id', ParseIntPipe ) id: number, 
    @Body() updateArticuloDto: UpdateArticuloDto
  ) {
    return this.articulosService.update(+id, updateArticuloDto);
  }

  @Delete(':id')
  remove(
    @Param('id',ParseIntPipe) id: number
  ) {
    return this.articulosService.remove(+id);
  }

}
