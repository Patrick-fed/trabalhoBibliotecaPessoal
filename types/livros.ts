export type StatusLeitura = 'quero_ler' | 'lendo' | 'lido';

export interface Livro {
  id?: string;
  uid: string;
  titulo: string;
  autor: string;
  genero: string;
  status: StatusLeitura;
  notaPessoal?: number;
  dataConclusao?: string | null;
  paginaAtual?: number;
  totalPaginas?: number;
}