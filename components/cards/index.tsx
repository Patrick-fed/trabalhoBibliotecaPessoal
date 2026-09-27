import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Livro } from '../../types/livros';

type LivroCardProps = {
  livro: Livro;
  aoPressionar: () => void;
}

export default function LivroCard({ livro, aoPressionar }: LivroCardProps) {
  
  
  const formatarStatus = (status: string) => {
    switch (status) {
      case 'quero_ler': return 'Quero Ler';
      case 'lendo': return 'Lendo';
      case 'lido': return 'Lido';
      default: return status;
    }
  };

  return (
    <Pressable style={styles.container} onPress={aoPressionar}>
        <Text style={styles.titulo}>{livro.titulo}</Text>
        
        <Text style={styles.text}>Autor: {livro.autor}</Text>
        <Text style={styles.text}>Gênero: {livro.genero}</Text>
        <Text style={styles.text}>Status: {formatarStatus(livro.status)}</Text>
        
        {/* Mostra a nota apenas se ela existir */}
        {livro.notaPessoal && (
          <Text style={styles.text}>Nota: {livro.notaPessoal}/5 ⭐️</Text>
        )}

        {/* REGRA DE NEGÓCIO: Mostra a data de conclusão apenas se o status for "lido" */}
        {livro.status === 'lido' && livro.dataConclusao && (
          <View style={styles.badge}>
            <Text style={styles.textBadge}>
              Lido em: {new Date(livro.dataConclusao).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}

        {/* Se o livro estiver sendo lido e tiver a página atual salva, mostra no card */}
        {livro.status === 'lendo' && livro.paginaAtual !== undefined && (
          <Text style={styles.text}>
            Lendo: Pág {livro.paginaAtual} {livro.totalPaginas ? `de ${livro.totalPaginas}` : ''}
          </Text>
        )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20, 
    backgroundColor: "purple",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  titulo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  badge: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  textBadge: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  }
});