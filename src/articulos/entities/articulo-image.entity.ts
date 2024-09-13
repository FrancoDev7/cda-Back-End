import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('articulo_images')
export class ArticuloImage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

}

