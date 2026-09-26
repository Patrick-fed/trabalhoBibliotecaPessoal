import { StyleSheet, Text, TextInput, View, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { cadastrar, entrar } from '../../service/auth';

export default function LoginScreen() {
  const [modoLogin, setModoLogin] = useState(true); // true = Login, false = Cadastro
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleAcao() {
    if (!email.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    if (!modoLogin && senha !== senhaConfirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setEnviando(true);
      setErro("");
      if (modoLogin) {
        await entrar(email, senha);
      } else {
        await cadastrar(email, senha);
      }
    } catch (error: any) {
      // Feedback amigável exigido no requisito 1
      setErro(modoLogin ? "E-mail ou senha incorretos." : "Não foi possível realizar o cadastro. Tente outra senha ou e-mail.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modoLogin ? "Entrar" : "Cadastrar"}</Text>
      
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {!modoLogin && (
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          value={senhaConfirmacao}
          onChangeText={setSenhaConfirmacao}
          secureTextEntry
        />
      )}

      <Pressable style={styles.botao} onPress={handleAcao} disabled={enviando}>
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>{modoLogin ? "Entrar" : "Cadastrar"}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => { setModoLogin(!modoLogin); setErro(""); }}>
        <Text style={styles.textoLink}>
          {modoLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 6 },
  botao: { backgroundColor: '#007BFF', padding: 15, borderRadius: 6, alignItems: 'center', marginBottom: 15 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textoLink: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
  erro: { color: 'red', marginBottom: 15, textAlign: 'center' }
});