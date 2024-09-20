import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ArticulosController } from './articulos.controller';
import { ArticulosService } from './articulos.service';

import { Articulo , ArticuloImage } from './entities';

@Module({
  controllers: [ArticulosController],
  providers: [ArticulosService],
  imports: [
    TypeOrmModule.forFeature([ Articulo, ArticuloImage ]),
    AuthModule
  ],
  exports: [ ArticulosService, TypeOrmModule ]
})
export class ArticulosModule {}
