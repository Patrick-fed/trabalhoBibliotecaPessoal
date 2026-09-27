import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore'; // <-- IMPORTANTE: getDoc trocado por onSnapshot
import { db } from '../../config/fireBase';
import { Livro } from '../../types/livros'; // Ajuste o caminho se necessário
import MarcadorPagina from '../../components/marcadorPagina'; // Ajuste o caminho de onde você salvou o componente

export default function DetalhesLivro({ route, navigation }: any) {
  const { id } = route.params;
  const [livro, setLivro] = useState<Livro | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'livros', id);

    // Substituindo getDoc por onSnapshot para atualizar a tela em tempo real
    const cancelarInscricao = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setLivro({ id: docSnap.id, ...docSnap.data() } as Livro);
      } else {
        // Se o documento não existir mais (ex: acabou de ser excluído), volta para a Home
        navigation.goBack();
      }
      setCarregando(false);
    }, (error) => {
      console.error("Erro ao buscar detalhes:", error);
      setCarregando(false);
    });

    // Limpa o ouvinte de tempo real quando saímos da tela
    return () => cancelarInscricao();
  }, [id]);

  async function deletarLivro() {
    Alert.alert('Excluir', 'Tem certeza que deseja remover este livro da sua biblioteca?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, 'livros', id));
          // Não precisamos chamar navigation.goBack() aqui porque o onSnapshot 
          // vai perceber a exclusão automaticamente e tratar isso lá em cima!
        } 
      }
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  if (!livro) return null;

  return (
    <View style={styles.container}>
      <View style={styles.cardInfo}>
        <Text style={styles.titulo}>{livro.titulo}</Text>
        <Text style={styles.texto}>Autor: {livro.autor}</Text>
        <Text style={styles.texto}>Gênero: {livro.genero || 'Não informado'}</Text>
        <Text style={styles.texto}>Status: {livro.status.replace('_', ' ').toUpperCase()}</Text>
        
        {livro.status === 'lido' && livro.notaPessoal !== undefined && (
          <Text style={styles.texto}>Nota: {livro.notaPessoal} / 5 ⭐️</Text>
        )}
      </View>

      {/* Renderiza o marcador se estiver lendo */}
      {livro.status === 'lendo' && (
        <MarcadorPagina 
          livroId={livro.id!} 
          paginaAtual={livro.paginaAtual || 0} 
          totalPaginas={livro.totalPaginas || 0} 
        />
      )}

      <Pressable style={styles.botaoExcluir} onPress={deletarLivro}>
        <Text style={styles.textoBotaoExcluir}>Excluir Livro</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { backgroundColor: 'purple', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  titulo: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  texto: { color: 'white', fontSize: 16, marginBottom: 6 },
  botaoExcluir: { backgroundColor: '#ff4d4d', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  textoBotaoExcluir: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});