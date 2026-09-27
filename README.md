# Biblioteca Pessoal

App mobile de biblioteca pessoal onde o usuário cadastra, organiza e acompanha os livros que está lendo. Os dados ficam na nuvem, sincronizados em tempo real entre os dispositivos.

## Funcionalidades

- **Autenticação** — cadastro e login com e-mail e senha; a sessão é mantida entre execuções.
- **Biblioteca** — listagem dos livros do usuário em tempo real, com busca por título ou autor.
- **Cadastro de livro** — título, autor, gênero e status de leitura.
- **Status de leitura** — `quero_ler`, `lendo` e `lido`, com campos que aparecem conforme a escolha.
- **Marcador de página** — para livros em leitura, controle de "página X de Y" com barra de progresso.
- **Nota pessoal** — avaliação de 0 a 5 para livros concluídos, junto com a data de conclusão.
- **Exclusão** — com confirmação antes de remover o livro.

## Tecnologias

| Tecnologia | Versão | Uso |
| --- | --- | --- |
| Expo | `~54.0.0` | Plataforma e ferramentas de build |
| React Native | `0.81.5` | Base do app |
| React | `19.1.0` | Biblioteca de UI |
| TypeScript | `~5.9.2` | Tipagem estática (`strict: true`) |
| React Navigation | `^7.4.1` | Navegação entre telas |
| React Navigation Native Stack | `^7.19.2` | Stack navigator nativo |
| Firebase | `^12.19.0` | Autenticação e banco de dados |
| React Native Screens | `~4.16.0` | Renderização nativa das telas |
| Async Storage | `2.2.0` | Armazenamento local |

O projeto não usa Expo Router: a entrada é `index.ts`, que registra `App.tsx` via `registerRootComponent`.

## Pré-requisitos

- Node.js e npm instalados.
- Um dispositivo ou emulador com o **Expo Go**, ou um simulador de iOS/Android.
- Uma conta no [Firebase](https://firebase.google.com/) para rodar o app com os dados da sua conta.

## Como rodar

```bash
npm install
npm start
```

O Metro Bundler sobe e você escaneia o QR code com o Expo Go. Para abrir direto em um alvo específico:

```bash
npm run android
npm run ios
npm run web
```

## Configuração do Firebase

O app depende do Firebase para autenticação e para o banco de dados, então essa configuração é obrigatória.

O repositório já vem com uma configuração em `config/fireBase.ts`. Para usar o seu próprio projeto:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Em **Authentication → Sign-in method**, habilite **E-mail/Senha**.
3. Em **Firestore Database**, crie o banco de dados.
4. Copie as credenciais do objeto `firebaseConfig` (as chaves `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` e `appId`).
5. Substitua o objeto `firebaseConfig` em `config/fireBase.ts` e mantenha os exports `auth` e `db`.

O arquivo fica assim:

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

Como a collection `livros` é criada no primeiro cadastro, nenhuma configuração inicial de banco é necessária.

## Estrutura do projeto

```
.
├── App.tsx                  # Navigator raiz e controle de sessão
├── index.ts                 # Ponto de entrada (registerRootComponent)
├── app.json                 # Configuração do Expo
├── assets/                  # Ícones e imagem de splash
├── components/
│   ├── cards/               # Card de livro usado na listagem
│   └── marcadorPagina/      # Controle de página atual + barra de progresso
├── config/
│   └── fireBase.ts          # Inicialização do Firebase (auth e db)
├── screens/
│   ├── login/               # Login e cadastro em uma única tela
│   ├── home/                # Biblioteca: busca, listagem e logout
│   ├── formularioLivro/     # Cadastro de livro
│   └── detalhesLivro/       # Detalhes, marcador de página e exclusão
├── service/
│   └── auth/                # Operações de autenticação (entrar, cadastrar, sair)
└── types/
    └── livros.ts            # Tipos do domínio (Livro, StatusLeitura)
```

**Convenção de pastas:** cada tela e componente fica em sua própria pasta, com a implementação em `index.tsx` e um único `default export`. Por isso o import é sempre `import HomeScreen from "./screens/home"`.

## Navegação

O app tem uma única stack, montada em `App.tsx`, e as rotas disponíveis mudam conforme o estado de autenticação.

| Rota | Tela | Acesso |
| --- | --- | --- |
| `Login` | Login / Cadastro | Deslogado, sem header |
| `Home` | Biblioteca | Logado, sem header |
| `FormularioLivro` | Adicionar Livro | Logado |
| `DetalhesLivro` | Detalhes do Livro | Logado, recebe `{ id: string }` |

`App.tsx` escuta `onAuthStateChanged` e troca a stack automaticamente quando o usuário entra ou sai, sem precisar navegar por código a partir das telas.

## Modelo de dados

Os livros ficam na collection Firestore `livros`. A lista de cada usuário é filtrada por `uid`, então cada pessoa enxerga apenas a própria biblioteca.

```ts
type StatusLeitura = "quero_ler" | "lendo" | "lido";

interface Livro {
  id?: string;             // id do documento no Firestore
  uid: string;             // dono do registro
  titulo: string;
  autor: string;
  genero: string;
  status: StatusLeitura;
  notaPessoal?: number;       // 0 a 5, quando status é "lido"
  dataConclusao?: string;      // ISO, quando status é "lido"
  paginaAtual?: number;       // quando status é "lendo"
  totalPaginas?: number;      // quando status é "lendo"
}
```

Os campos opcionais são gravados apenas quando fazem sentido para o status: página e total de páginas só existem para livros em leitura; nota e data de conclusão, para livros concluídos.

A sincronização é em tempo real — a listagem e a tela de detalhes usam `onSnapshot`, então alterações aparecem na tela sem recarregar.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm start` | Sobe o Metro Bundler |
| `npm run android` | Abre o app no Android |
| `npm run ios` | Abre o app no iOS |
| `npm run web` | Abre o app no navegador |

## Licença

MIT
