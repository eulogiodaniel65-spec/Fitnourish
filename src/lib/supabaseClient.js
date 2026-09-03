// src/lib/supabaseClient.js
//
// Cliente único de Supabase para toda la app. Se importa desde
// cualquier componente que necesite leer o escribir datos.
//
// Necesita dos variables de entorno (las sacás de Supabase en
// Project Settings → API):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
//
// Creá un archivo .env.local en la raíz del proyecto con esas dos
// variables. Nunca subas ese archivo a git (agregalo a .gitignore).

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en las variables de entorno."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente auxiliar, con sesión SIN persistir. Se usa solo para crear
// cuentas de alumnos desde adentro de la app (invitar), así ese
// signUp no reemplaza tu sesión de profesor en el navegador.
const supabaseAux = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ------------------------------------------------------------
// Autenticación
// ------------------------------------------------------------

// Registra un alumno nuevo (lo invita el profesor desde la app).
// Usa el cliente auxiliar para no pisar la sesión del profesor.
export async function registrarAlumno({ email, password, nombre }) {
  const resultado = await supabaseAux.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, rol: "alumno" },
    },
  });
  await supabaseAux.auth.signOut();
  return resultado;
}

// Registro del profesor (se usa una sola vez, al armar la cuenta principal).
export async function registrarProfesor({ email, password, nombre }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, rol: "profesor" },
    },
  });
}

export async function iniciarSesion({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function cerrarSesion() {
  return supabase.auth.signOut();
}

// Trae el perfil (nombre, rol) del usuario actualmente logueado.
export async function obtenerUsuarioActual() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return null;

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (error) throw error;
  return data;
}