export interface TipoRostro {
  idTipo: number;
  nombreTipo: string;
  descripcionTipo: string;
  imagenTipo: string;
}

export interface Formula {
  idFormula: number;
  idUsuario: number;
  vigencia: boolean;
  fechaCarga: string;
  formulaPDF: string;
  observacion: string;
}

export interface Cliente {
  idUsuario: number;
  idFormulaActual?: number | null;
  idTipo?: number | null;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoUsuario: string;
  fechaNacimiento: string;
  direccion: string;
  rol: string;
  tipo_rostro?: TipoRostro | null;
  formula_actual?: Formula | null;
}

export interface CreateCliente {
  idUsuario: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  correoUsuario: string;
  fechaNacimiento: string;
  direccion: string;
  contrasena: string;
  rol?: string;
}

export interface UpdateCliente {
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  correoUsuario?: string;
  direccion?: string;
  idTipo?: number | null;
  idFormulaActual?: number | null;
}

export interface Material {
  idMaterial: number;
  nombreMaterial: string;
}

export interface Montura {
  idMontura: number;
  idMaterial: number;
  nombreMontura: string;
  imagenMontura: string;
  stockMontura: number;
  colorMontura: string;
  generoMontura: string;
  precioMontura: number;
  material?: Material | null;
}

export interface TransaccionDetalle {
  idRequiere: number;
  idMontura: number;
  idFormula?: number | null;
  idTransaccion: number;
  subtotal: number;
  lentesR: boolean;
  cantidadR: number;
  precioUnitarioR: number;
  montura?: Montura | null;
}

export interface Transaccion {
  idTransaccion: number;
  idUsuario: number;
  fechaTransaccion: string;
  direccionEnvio: string;
  estadoTransaccion: string;
  metodoPago: string;
  totalTransaccion: number;
  detalles: TransaccionDetalle[];
}

export interface CreateTransaccionDetalle {
  idMontura: number;
  idFormula?: number | null;
  lentesR: boolean;
  cantidadR: number;
  precioUnitarioR: number;
}

export interface CreateTransaccion {
  idTransaccion: number;
  idUsuario: number;
  direccionEnvio: string;
  metodoPago: string;
  tipoTransaccion?: string;
  detalles: CreateTransaccionDetalle[];
}

export interface Recomendacion {
  idRecomendacion: number;
  idTipo: number;
  idMontura: number;
  nivelCompatibilidad: number;
  montura?: Montura | null;
}
