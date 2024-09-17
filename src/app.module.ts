import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticulosModule } from './articulos/articulos.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    // El config module se encarga de cargar las variables de entorno
    ConfigModule.forRoot(),

    // TypeOrmModule.forRoot() se encarga de configurar la conexion a la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      // Synchronize crea las tablas si no existen
      synchronize: true,

    }),

    ArticulosModule,

    CommonModule,

    SeedModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
