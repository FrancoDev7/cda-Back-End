import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateArticuloDto, UpdateArticuloDto } from './dto';
import { Articulo, ArticuloImage } from './entities';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ArticulosService {

  // Logger es una clase que se usa para registrar información de depuración en la consola
  private readonly logger = new Logger('ArticulosService');

  constructor(
    //inyectando el repositorio de la entidad Articulo para que puedas usarlo en los métodos de tu servicio.
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,

    @InjectRepository(ArticuloImage)
    private articuloImageRepository: Repository<ArticuloImage>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createArticuloDto: CreateArticuloDto) {

    try {

      const { images = [], ...articuloDetails } = createArticuloDto;

      //creando el articulo con los datos del DTO 
      const articulo = this.articuloRepository.create({
        ...articuloDetails,
        images: images.map( image => this.articuloImageRepository.create({ url: image }))
      });

      //guardando el articulo en la base de datos
      await this.articuloRepository.save( articulo );

      // Actualizar el codigo_interno después de la inserción
      articulo.codigo_interno = `${articulo.nombre.substring(0,3)}${articulo.unidad_medida.charAt(0)}${articulo.id}`.toUpperCase();

      //guardando el articulo en la base de datos con el codigo_interno actualizado
      await this.articuloRepository.save(articulo);

      //retornando el articulo creado
      return {
        ...articulo,
        images
      };

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  //metodo para obtener todos los articulos con paginacion 
  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;	

    const [ articulos, total ] = await this.articuloRepository.findAndCount({
      take: limit,
      skip: offset,
      where: { activo: true },
      order: { id: 'ASC' },
      relations: { images: true }
    });

    return {
      data: articulos.map(articulo => ({
        ...articulo,
        images: articulo.images.map(img => img.url),
      })),
      total, // El total de artículos en la base de datos
      limit, // Cantidad de artículos por página
      offset, // Desplazamiento actual
    };
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
      .leftJoinAndSelect('articulo.images', 'images')
      .getOne();
    }

    if ( !articulo ) throw new NotFoundException(`Articulo con el ${ term } no encontrado`);
    
    return articulo;

  }

  async findOnePlain( term: string | number ) {
    const { images = [], ...rest } = await this.findOne( term.toString() );
    return {
      ...rest,
      images: images.map( img => img.url )
    };
  }

  //metodo para actualizar un articulo por su id
  async update( id: number, updateArticuloDto: UpdateArticuloDto ) {

    const { images, ...toUpdate } = updateArticuloDto;

    const articulo = await this.articuloRepository.preload({
      id,
      ...toUpdate, //spread operator para actualizar los campos del articulo con los datos del DTO 
    });

    if ( !articulo ) throw new NotFoundException(`Articulo con el id: ${ id } no encontrado`);

    //actualizando las imagenes del articulo createQueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      if ( images ) {
        await queryRunner.manager.delete(ArticuloImage, { articulo: { id } });

        articulo.images = images.map( 
          image => this.articuloImageRepository.create({ url: image })
        );
      }

      //await this.articuloRepository.save( articulo );
      await queryRunner.manager.save( articulo );
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain( id );

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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

  async deleteAllArticulos() {
    const query = this.articuloRepository.createQueryBuilder('articulo');

    try {
      return await query
      .delete()
      .where({})
      .execute();

    } catch (error) {
      this.handleDBExceptions(error);   
    }
  }
}
