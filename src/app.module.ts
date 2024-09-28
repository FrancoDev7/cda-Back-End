import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ArticulosModule } from './articulos/articulos.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';


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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),

    ArticulosModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
