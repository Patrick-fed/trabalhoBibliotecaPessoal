import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../config/fireBase';
import { sair } from '../../service/auth';
import { Livro } from '../../types/livros';
import Card from '../../components/cards';


function LivroCard({ livro, aoPressionar }: { livro: Livro; aoPressionar: () => void }) {
  return (
    <Pressable style={styles.card} onPress={aoPressionar}>
      <Text style={styles.tituloLivro}>{livro.titulo}</Text>
      <Text style={styles.textoCard}>Autor: {livro.autor}</Text>
      <Text style={styles.textoCard}>Status: {livro.status.replace('_', ' ')}</Text>
      {livro.status === 'lido' && livro.dataConclusao && (
        <Text style={styles.textoConclusao}>
          Concluído em: {new Date(livro.dataConclusao).toLocaleDateString('pt-BR')}
        </Text>
      )}
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuario = auth.currentUser;
    if (!usuario) return;

    
    const q = query(
      collection(db, 'livros'),
      where('uid', '==', usuario.uid)
    );

    
    const cancelarInscricao = onSnapshot(q, (snapshot) => {
      const listaLivros: Livro[] = [];
      snapshot.forEach((doc) => {
        listaLivros.push({ id: doc.id, ...doc.data() } as Livro);
      });
      setLivros(listaLivros);
      setCarregando(false);
    }, (erro) => {
      console.error("Erro ao buscar livros:", erro);
      setCarregando(false);
    });

    return () => cancelarInscricao();
  }, []);

  
  const livrosFiltrados = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    livro.autor.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Carregando sua biblioteca...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.tituloTela}>Meus Livros</Text>
        <Pressable onPress={sair} style={styles.botaoSair}>
          <Text style={styles.textoSair}>Sair</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar por título ou autor..."
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={livrosFiltrados}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <Card 
            livro={item} 
            aoPressionar={() => navigation.navigate('DetalhesLivro', { id: item.id })} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.centroLista}>
            <Text style={styles.textoVazio}>
              {busca 
                ? "Nenhum livro encontrado para esta busca." 
                : "Sua biblioteca está vazia. Adicione um livro!"}
            </Text>
          </View>
        }
        contentContainerStyle={livrosFiltrados.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
      />

      <Pressable 
        style={styles.botaoAdicionar} 
        onPress={() => navigation.navigate('FormularioLivro')}
      >
        <Text style={styles.textoAdicionar}>+ Novo Livro</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16, paddingTop: 40 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tituloTela: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  botaoSair: { padding: 8, backgroundColor: '#ff4d4d', borderRadius: 4 },
  textoSair: { color: '#fff', fontWeight: 'bold' },
  inputBusca: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  tituloLivro: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  textoCard: { fontSize: 14, color: '#666', marginBottom: 2 },
  textoConclusao: { fontSize: 12, color: '#2e7d32', marginTop: 8, fontWeight: '600' },
  centroLista: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoVazio: { color: '#666', fontSize: 16, textAlign: 'center', marginTop: 40 },
  botaoAdicionar: { backgroundColor: '#007BFF', padding: 16, borderRadius: 30, position: 'absolute', bottom: 20, right: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  textoAdicionar: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});