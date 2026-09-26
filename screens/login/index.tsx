import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View  } from 'react-native';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 
import { auth } from '../../config/fireBase';
import { cadastrar, entrar } from '../../service/auth';

export default function LoginScreen() {
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [senhaConfirmacao, setSenhaConfirmacao] = useState("")
const [senhaCadastro, setSenhaCadastro] = useState("");
const [emailCadastro, setEmailCadastro] = useState("");
const [erro, setErro] = useState("");
const [enviando, setEnviando] = useState(false);
const [cadastrado, setCadastrado] = useState<boolean>(true);

async function handleLogin() {
  
        if (!email.trim() || !senha) {
            setErro("Preencha e-mail e senha.");
            return;
        }else if(senha === senhaConfirmacao){
            setSenha(senhaConfirmacao);
        }
        try {
            setEnviando(true);
            setErro("");
            await entrar(email, senha);
        } catch {
            setErro("Não foi possível entrar. Verifique seus dados.");
        } finally {
            setEnviando(false);
        }
    } 


async function handleCadastro() {
        
        if(!email.trim() || !senha){
            setErro("Não foi possivel cadastrar");
            return
        }
        try{
            setEnviando(true);
            setErro("");
            await cadastrar(email, senha)
            setCadastrado(true);
        }catch{
            setErro("Não foi possivel cadastrar.");
        }finally{
            setEnviando(false);
        }
    
}

function renderLogin(){
    return(
    <View style={styles.container} >
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Pressable
        onPress={handleLogin}
        disabled={enviando}
      >
        <Text>
        {enviando ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>
    </View>)
}

function renderCadastro(){
    return (<View>
    <Text>Cadastro</Text>


      <TextInput
        placeholder="Cadastro"
        value={email}
        onChangeText={setEmailCadastro}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha cadastro"
        value={senha}
        onChangeText={setSenhaCadastro}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirme sua senha"
        value={senha}
        onChangeText={setSenhaConfirmacao}
        secureTextEntry
      />
      <Pressable
        onPress={handleCadastro}
        disabled={enviando}
      >
        <Text>
        {enviando ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>
    </View>)
}

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



  return (

    <View style={styles.container} >
     {!cadastrado ? renderLogin(): renderCadastro()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
