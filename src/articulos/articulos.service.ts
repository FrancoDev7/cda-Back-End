import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticulosService {

  // Logger es una clase que se usa para registrar información de depuración en la consola
  private readonly logger = new Logger('ArticulosService');

  constructor(
    //inyectando el repositorio de la entidad Articulo para que puedas usarlo en los métodos de tu servicio.
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,

  ) {}

  async create(createArticuloDto: CreateArticuloDto) {

    try {
      
      const articulo = this.articuloRepository.create( createArticuloDto );
      await this.articuloRepository.save( articulo );

       // Actualizar el codigo_interno después de la inserción
      articulo.codigo_interno = `${articulo.nombre.substring(0,3)}${articulo.unidad_medida.charAt(0)}${articulo.id}`.toUpperCase();
      await this.articuloRepository.save(articulo);
      return articulo;

    } catch (error) {
      this.handleDBExceptions(error);
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

  private handleDBExceptions( error: any ) {

    if (error.code === '23505') 
      throw new BadRequestException(error.detail);
    
    this.logger.error(error)
    
    throw new InternalServerErrorException('Error inesperado, Check the logs for more information');
  }

}
