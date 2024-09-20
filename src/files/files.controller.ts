import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';



@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  
  ) {}

  


  @Get('articulo/:imageName')
  findArticuloImage(
    @Res() res : Response,
    @Param('imageName') imageName: string
  ) {
    
    const path = this.filesService.getStaticArticuloImage( imageName );

    res.sendFile( path );

  }

  @Post('articulo')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/articulos',
      filename: fileNamer
    })
  }) )
  uploadArticuloImage( 
    @UploadedFile() file: Express.Multer.File,
  ) {

    if ( !file ) {
      throw new BadRequestException('Asegurate de subir un archivo en formato correcto (jpg, jpeg, png, gif)');
    }

    const secureURL = `${this.configService.get('HOST_API')}/files/articulo/${ file.filename }`;

    return { secureURL };

  }
}
