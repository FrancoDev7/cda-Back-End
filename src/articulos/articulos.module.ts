import { Module } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';

@Module({
  controllers: [ArticulosController],
  providers: [ArticulosService],
  imports: [
    TypeOrmModule.forFeature([ Articulo ])
  ]
})
export class ArticulosModule {}
