import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, BeforeInsert, } from 'typeorm';

// Un Entity es una clase que mapea una tabla en la base de datos
@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn()
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
    unique: true,
    nullable:true
    
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

  // @BeforeInsert()
  // updateCodigoInterno() {
  //   this.codigo_interno = `${this.nombre.substring(0,3)}${this.unidad_medida.charAt(0)}${this.id}`.toUpperCase();
  // }
  // @AfterInsert()
  // updateCodigoInterno() {
  //   this.codigo_interno = `${this.nombre.substring(0,3)}${this.unidad_medida.charAt(0)}${this.id}`.toUpperCase();
  //   // No es necesario hacer un await ya que el campo se actualiza antes de insertar el registro

  // }

  


  
}
