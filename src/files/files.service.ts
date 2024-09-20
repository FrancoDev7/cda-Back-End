import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';


@Injectable()
export class FilesService {


  getStaticArticuloImage( imageName: string ) {

    const path = join( __dirname, '../../static/articulos', imageName );

    if ( !existsSync( path ) ) {
      throw new BadRequestException(`No existe el archivo ${ imageName }`);
    }
  
    return path;
  }

}
