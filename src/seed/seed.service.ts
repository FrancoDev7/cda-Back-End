import { Injectable } from '@nestjs/common';
import { ArticulosService } from '../articulos/articulos.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly articulosService: ArticulosService
  ) {}

  async runSeed() {
    await this.insertNewArticulos();
    return 'Seed executed'; 
  }

  private async insertNewArticulos() {
    
    await this.articulosService.deleteAllArticulos();

    const articulos = initialData.articulos;

    const insertPromises = [];

    articulos.forEach(articulo => {
      insertPromises.push(this.articulosService.create( articulo ));
    })

    await Promise.all(insertPromises);

    return true;
  }

}
