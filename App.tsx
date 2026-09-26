import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";


import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import { auth } from "./config/fireBase";

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

  return usuario
    ? <HomeScreen usuario={usuario} />
    : <LoginScreen />;
}