import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticulosService } from '../articulos/articulos.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly articulosService: ArticulosService,

    @InjectRepository( User )
    private userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await  this.insertNewUsers();

    await this.insertNewArticulos( adminUser );
    return 'Seed executed'; 
  }

  private async deleteTables() {

    await this.articulosService.deleteAllArticulos();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;

    const users : User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0]
    

  }

  private async insertNewArticulos( user: User) {
    
    await this.articulosService.deleteAllArticulos();

    const articulos = initialData.articulos;

    const insertPromises = [];

    articulos.forEach(articulo => {
      insertPromises.push(this.articulosService.create( articulo, user ));
    })

    await Promise.all(insertPromises);

    return true;
  }

}
