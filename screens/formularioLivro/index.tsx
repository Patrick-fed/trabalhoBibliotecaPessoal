import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/fireBase';
import { StatusLeitura } from '../../types/livros'; 

export default function FormularioLivro({ navigation }: any) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [status, setStatus] = useState<StatusLeitura>('quero_ler');
  const [nota, setNota] = useState('');
  const [totalPaginas, setTotalPaginas] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvarLivro() {
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Erro', 'Título e Autor são obrigatórios!');
      return;
    }

    const usuario = auth.currentUser;
    if (!usuario) return;

    try {
      setSalvando(true);
      
      const novoLivro = {
        uid: usuario.uid,
        titulo,
        autor,
        genero,
        status,
        ...(status === 'lido' && { notaPessoal: Number(nota) || 0, dataConclusao: new Date().toISOString() }),
        ...(status === 'lendo' && { paginaAtual: 0, totalPaginas: Number(totalPaginas) || 0 })
      };

      await addDoc(collection(db, 'livros'), novoLivro);
      Alert.alert('Sucesso', 'Livro adicionado à sua biblioteca!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Título do Livro *</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: O Senhor dos Anéis" />

      <Text style={styles.label}>Autor *</Text>
      <TextInput style={styles.input} value={autor} onChangeText={setAutor} placeholder="Ex: J.R.R. Tolkien" />

      <Text style={styles.label}>Gênero</Text>
      <TextInput style={styles.input} value={genero} onChangeText={setGenero} placeholder="Ex: Fantasia" />

      <Text style={styles.label}>Status de Leitura</Text>
      <View style={styles.statusContainer}>
        {(['quero_ler', 'lendo', 'lido'] as StatusLeitura[]).map((s) => (
          <Pressable 
            key={s} 
            style={[styles.statusBotao, status === s && styles.statusBotaoAtivo]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.statusTexto, status === s && styles.statusTextoAtivo]}>
              {s.replace('_', ' ').toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {status === 'lendo' && (
        <>
          <Text style={styles.label}>Total de Páginas</Text>
          <TextInput style={styles.input} value={totalPaginas} onChangeText={setTotalPaginas} keyboardType="numeric" placeholder="Ex: 320" />
        </>
      )}

      {status === 'lido' && (
        <>
          <Text style={styles.label}>Sua Nota (0 a 5)</Text>
          <TextInput style={styles.input} value={nota} onChangeText={setNota} keyboardType="numeric" placeholder="Ex: 5" maxLength={1} />
        </>
      )}

      <Pressable style={styles.botaoSalvar} onPress={salvarLivro} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotaoSalvar}>Salvar Livro</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  statusBotao: { flex: 1, padding: 12, backgroundColor: '#e0e0e0', marginHorizontal: 4, borderRadius: 8, alignItems: 'center' },
  statusBotaoAtivo: { backgroundColor: 'purple' },
  statusTexto: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  statusTextoAtivo: { color: '#fff' },
  botaoSalvar: { backgroundColor: '#007BFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  textoBotaoSalvar: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});