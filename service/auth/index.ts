import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../config/fireBase";

export async function cadastrar(email: string, senha: string) {
  const credencial = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    senha,
  );

  return credencial.user;
}

export async function entrar(email: string, senha: string) {
  const credencial = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    senha,
  );

  return credencial.user;
}

export async function sair() {
  await signOut(auth);
}