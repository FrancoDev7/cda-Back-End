import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

//La información que se recibe del cliente para crear un nuevo artículo
export class CreateArticuloDto {

  @IsString()
  @MinLength(1)
  nombre: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  sap?: number;

  
  codigo_interno: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  sku?: number;

  @IsString()
  unidad_medida : string;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;

  @IsOptional()
  activo?: boolean;

}
