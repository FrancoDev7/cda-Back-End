import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Articulo } from "./articulo.entity";


@Entity('articulo_images')
export class ArticuloImage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Articulo,
    ( articulo ) => articulo.images,
    { onDelete: 'CASCADE' }
  )
  articulo: Articulo

}

