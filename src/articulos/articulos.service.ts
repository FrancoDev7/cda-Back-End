import { Injectable } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  create(createArticuloDto: CreateArticuloDto) {
    return 'This action adds a new articulo';
  }

  findAll() {
    return `This action returns all articulos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articulo`;
  }

  update(id: number, updateArticuloDto: UpdateArticuloDto) {
    return `This action updates a #${id} articulo`;
  }

  remove(id: number) {
    return `This action removes a #${id} articulo`;
  }
}
