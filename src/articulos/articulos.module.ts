import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';
import { Articulo , ArticuloImage } from './entities';

@Module({
  controllers: [ArticulosController],
  providers: [ArticulosService],
  imports: [
    TypeOrmModule.forFeature([ Articulo, ArticuloImage ])
  ]
})
export class ArticulosModule {}
