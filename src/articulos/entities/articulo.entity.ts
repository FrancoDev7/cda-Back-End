import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Un Entity es una clase que mapea una tabla en la base de datos
@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // Nombre es unico y no puede ser nulo
  @Column('text', 
    { unique: true }
  )
  nombre: string;

  // SAP es opcional y por defecto es 0
  @Column('int',{
    nullable: true,
    default: 0
  })
  sap: number;

  @Column('text',{
    unique: true
  })
  codigo_interno: string;

  // SKU es opcional y por defecto es 0
  @Column('int', {
    default: 0,
    nullable: true
  })	
  sku: number;

  @Column('text')
  unidad_medida : string;

  // Comentario es opcional
  @Column({nullable: true})
  comentario: string;

  // Precio por defecto es 0 y puede ser opcional
  @Column('float',{
    default: 0,
    nullable: true
  })
  precio: number;

  // Activo por defecto es true
  @Column('bool',{
    default: true
  })
  activo: boolean;


  
}
