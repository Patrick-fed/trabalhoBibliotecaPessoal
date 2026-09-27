import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import FormularioLivro from "./screens/formularioLivro";
import DetalhesLivro from "./screens/detalhesLivro";
import { auth } from "./config/fireBase";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  FormularioLivro: undefined;
  DetalhesLivro: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  useEffect(() => {
    const cancelarObservacao = onAuthStateChanged(
      auth,
      (usuarioAtual) => {
        setUsuario(usuarioAtual);
        setVerificandoSessao(false);
      },
    );

    return cancelarObservacao;
  }, []);

  if (verificandoSessao) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {usuario ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="FormularioLivro" 
              component={FormularioLivro} 
              options={{ title: 'Adicionar Livro' }} 
            />
            <Stack.Screen 
              name="DetalhesLivro" 
              component={DetalhesLivro} 
              options={{ title: 'Detalhes do Livro' }} 
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  }
});

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