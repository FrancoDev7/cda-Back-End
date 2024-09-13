import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, } from 'typeorm';

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

  // Precio por defecto es 0 y puede ser opcional quiero que sea en dolares 
  @Column('decimal',{
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true
  })
  precio: number;

  // Activo por defecto es true
  @Column('bool',{
    default: true
  })
  activo: boolean;

 
  // Cuando se inserte un nuevo articulo se debe guardar el precio en dolares ejemplo si pasa 150 debe ser 150.00
  @BeforeInsert()
  @BeforeUpdate()
  formatPrecio() {
    if (this.precio != null) {
      this.precio = Number(Number(this.precio).toFixed(2));
    }
  }
}
