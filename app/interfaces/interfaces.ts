export interface Feriado {
  id: number;
  fecha: string;
  nombre: string;
}

export interface Registro {
  id: number;
  fechaGeneracion: string;
  titulo: string;
  fechaInicio: string;
  modalidad: { id: number; nombre: string };
  monto: number;
  fechaPresentacion: string;
  fechaApertura: string;
  fechaAdjudicacion: string;
  fechaPresentacionDocs: string;
  fechaFirmaContratos: string;
  usuarioCreacion: string;
  etapas: Record<string, string>;
}

export interface Etapa {
  id: number;
  nombre: string;
  usuarioModificacion?: string | null;
  eliminado?: boolean;
}

export interface Modalidad {
  id: number;
  nombre: string;
  presentacion: string;
  apertura: string;
  adjudicacion: string;
  presentacion_docs: string;
  firma: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRegistros: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
