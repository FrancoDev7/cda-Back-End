import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticulosService {

  constructor(
    //inyectando el repositorio de la entidad Articulo para que puedas usarlo en los métodos de tu servicio.
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,

  ) {}

  async create(createArticuloDto: CreateArticuloDto) {

    try {

      const articulo = this.articuloRepository.create( createArticuloDto );
      await this.articuloRepository.save( articulo );
      return articulo;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al guardar el artículo');
    }



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
