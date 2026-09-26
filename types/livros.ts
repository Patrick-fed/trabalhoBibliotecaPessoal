export type StatusLeitura = 'quero_ler' | 'lendo' | 'lido';

export interface Livro {
  id?: string;
  uid: string; // Obrigatório para o isolamento de usuários (Requisito 8)
  titulo: string;
  autor: string;
  genero: string;
  status: StatusLeitura;
  notaPessoal?: number; // 1 a 5
  dataConclusao?: string | null; // Regra de negócio
}