import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/fireBase';

type MarcadorProps = {
  livroId: string;
  paginaAtual: number;
  totalPaginas: number;
}

export default function MarcadorPagina({ livroId, paginaAtual, totalPaginas }: MarcadorProps) {
  const [salvando, setSalvando] = useState(false);

  async function alterarPagina(incremento: number) {
    const novaPagina = paginaAtual + incremento;
    
    if (novaPagina < 0 || (totalPaginas && novaPagina > totalPaginas)) return;

    try {
      setSalvando(true);
      const livroRef = doc(db, 'livros', livroId);
      
      await updateDoc(livroRef, {
        paginaAtual: novaPagina
      });
      
    } catch (erro) {
      console.error("Erro ao atualizar página:", erro);
    } finally {
      setSalvando(false);
    }
  }

  const progresso = totalPaginas ? (paginaAtual / totalPaginas) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Progresso de Leitura</Text>
      
      <View style={styles.controles}>
        <Pressable 
          style={styles.botaoAcao} 
          onPress={() => alterarPagina(-1)}
          disabled={salvando || paginaAtual <= 0}
        >
          <Text style={styles.textoBotao}>-</Text>
        </Pressable>

        <View style={styles.centroTexto}>
          {salvando ? (
             <ActivityIndicator color="purple" />
          ) : (
             <Text style={styles.textoPagina}>
               Pág. {paginaAtual} {totalPaginas ? `/ ${totalPaginas}` : ''}
             </Text>
          )}
        </View>

        <Pressable 
          style={styles.botaoAcao} 
          onPress={() => alterarPagina(1)}
          disabled={salvando || (!!totalPaginas && paginaAtual >= totalPaginas)}  
        >
          <Text style={styles.textoBotao}>+</Text>
        </Pressable>
      </View>

      {/* Barrinha de progresso visual */}
      {!!totalPaginas && (
        <View style={styles.barraFundo}>
          <View style={[styles.barraProgresso, { width: `${progresso}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  controles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoAcao: {
    backgroundColor: 'purple',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2, 
  },
  centroTexto: {
    width: 100,
    alignItems: 'center',
  },
  textoPagina: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'purple',
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: 'purple',
  }
});