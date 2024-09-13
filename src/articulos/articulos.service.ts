import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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
      //creando el articulo con los datos del DTO 
      const articulo = this.articuloRepository.create( createArticuloDto );
      //guardando el articulo en la base de datos
      await this.articuloRepository.save( articulo );

      // Actualizar el codigo_interno después de la inserción
      articulo.codigo_interno = `${articulo.nombre.substring(0,3)}${articulo.unidad_medida.charAt(0)}${articulo.id}`.toUpperCase();
      //guardando el articulo en la base de datos con el codigo_interno actualizado
      await this.articuloRepository.save(articulo);
      //retornando el articulo creado
      return articulo;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  //metodo para obtener todos los articulos con paginacion 
  findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;	

    return this.articuloRepository.find({
      take: limit,
      skip: offset,
      where: { activo: true }
    });
    
  }

  //metodo para obtener un articulo por su id y nombre y  no mostrar los articulos eliminados activo = false
  async findOne( term: string ) {
    let articulo: Articulo;

    if ( !isNaN( +term ) ) {
      articulo = await this.articuloRepository.findOneBy({ id: +term, activo: true });
    } else {
      const query = this.articuloRepository.createQueryBuilder('articulo');
      articulo = await query
      .where('UPPER(articulo.nombre) = :nombre', { 
        nombre: term.toUpperCase() 
      })
      .andWhere('articulo.activo = :activo', { activo: true })
      .getOne();
    }

    if ( !articulo ) throw new NotFoundException(`Articulo con el ${ term } no encontrado`);
    return articulo;
  }

  //metodo para actualizar un articulo por su id
  async update( id: number, updateArticuloDto: UpdateArticuloDto ) {

    const articulo = await this.articuloRepository.preload({
      id: id,
      ...updateArticuloDto, //spread operator para actualizar los campos del articulo con los datos del DTO 
    });

    if ( !articulo ) throw new NotFoundException(`Articulo con el id: ${ id } no encontrado`);

    try {
      await this.articuloRepository.save( articulo );
      return articulo;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //metodo para eliminar un articulo por su id y cambiar el activo a false
  async remove( id: number ) {
    const articulo = await this.findOne( id.toString() );
    articulo.activo = false;
    await this.articuloRepository.save( articulo );
    return articulo;
  }

  //metodo para manejar las excepciones de la base de datos
  //error.code es un codigo de error que se puede devolver desde la base de datos
  private handleDBExceptions( error: any ) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Error inesperado, Check the logs for more information');
  }

}
