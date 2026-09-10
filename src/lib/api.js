// src/lib/api.js
//
// Todas las funciones que leen y escriben datos reales en Supabase.
// App.jsx y las vistas llaman a estas funciones en vez de tocar
// supabase directamente.

import { supabase, registrarAlumno } from "./supabaseClient";

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

// ============================================================
// LECTURA
// ============================================================

export async function fetchAlumnos() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre")
    .eq("rol", "alumno")
    .order("nombre");
  if (error) throw error;
  return data || [];
}

export async function fetchDiasDeAlumno(alumnoId) {
  const { data: rutina, error: eR } = await supabase
    .from("rutinas")
    .select("id")
    .eq("alumno_id", alumnoId)
    .eq("activa", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (eR) throw eR;
  if (!rutina) return { rutinaId: null, days: [] };

  const { data: dias, error: eD } = await supabase
    .from("dias")
    .select("id, nombre, foco, orden")
    .eq("rutina_id", rutina.id)
    .order("orden");
  if (eD) throw eD;

  const fecha = hoy();
  const result = [];

  for (const d of dias || []) {
    const { data: des, error: eDE } = await supabase
      .from("dia_ejercicios")
      .select(
        "id, series, reps, peso_objetivo, descanso_series_seg, descanso_posterior_seg, orden, ejercicios ( id, nombre, url_media )"
      )
      .eq("dia_id", d.id)
      .order("orden");
    if (eDE) throw eDE;

    const { data: sesion, error: eS } = await supabase
      .from("sesiones")
      .select("id, duracion_segundos, esfuerzo_percibido_borg")
      .eq("dia_id", d.id)
      .eq("alumno_id", alumnoId)
      .eq("fecha", fecha)
      .maybeSingle();
    if (eS) throw eS;

    let registros = [];
    if (sesion) {
      const { data: regs, error: eR2 } = await supabase
        .from("registros")
        .select("*")
        .eq("sesion_id", sesion.id);
      if (eR2) throw eR2;
      registros = regs || [];
    }

    const deIds = (des || []).map((x) => x.id);
    let comentarios = [];
    if (deIds.length) {
      const { data: coms, error: eC } = await supabase
        .from("comentarios")
        .select("id, dia_ejercicio_id, autor_id, texto, usuarios ( nombre, rol )")
        .in("dia_ejercicio_id", deIds)
        .order("fecha");
      if (eC) throw eC;
      comentarios = coms || [];
    }

    const exercises = (des || []).map((de) => {
      const reg = registros.find((r) => r.dia_ejercicio_id === de.id);
      const coms = comentarios
        .filter((c) => c.dia_ejercicio_id === de.id)
        .map((c) => ({ id: c.id, author: c.usuarios?.rol, authorName: c.usuarios?.nombre, text: c.texto }));
      return {
        id: de.id,
        catalogId: de.ejercicios?.id,
        name: de.ejercicios?.nombre || "Ejercicio",
        sets: de.series,
        reps: de.reps,
        targetWeight: de.peso_objetivo || "-",
        restSets: de.descanso_series_seg,
        restAfter: de.descanso_posterior_seg,
        mediaUrl: de.ejercicios?.url_media || null,
        done: !!reg,
        logWeight: reg?.peso_logrado || "",
        logReps: reg?.reps_logradas || "",
        showComments: false,
        comments: coms,
      };
    });

    result.push({
      day: d.nombre,
      focus: d.foco || "",
      dayId: d.id,
      rpeBorg: sesion?.esfuerzo_percibido_borg ?? null,
      exercises,
    });
  }

  return { rutinaId: rutina.id, days: result };
}

export async function fetchAlumnosConRutinas() {
  const alumnos = await fetchAlumnos();
  const resultado = [];
  for (const a of alumnos) {
    const { rutinaId, days } = await fetchDiasDeAlumno(a.id);
    resultado.push({ id: a.id, name: a.nombre, rutinaId, days });
  }
  return resultado;
}

// ============================================================
// ESCRITURA
// ============================================================

async function getOrCrearSesionHoy(dayId, alumnoId) {
  const fecha = hoy();
  const { data, error } = await supabase
    .from("sesiones")
    .upsert({ dia_id: dayId, alumno_id: alumnoId, fecha }, { onConflict: "dia_id,alumno_id,fecha" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function marcarEjercicio({ dayId, alumnoId, diaEjercicioId, hecho }) {
  const sesion = await getOrCrearSesionHoy(dayId, alumnoId);
  if (hecho) {
    const { error } = await supabase
      .from("registros")
      .upsert({ sesion_id: sesion.id, dia_ejercicio_id: diaEjercicioId }, { onConflict: "sesion_id,dia_ejercicio_id" });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("registros")
      .delete()
      .eq("sesion_id", sesion.id)
      .eq("dia_ejercicio_id", diaEjercicioId);
    if (error) throw error;
  }
}

export async function guardarLog({ dayId, alumnoId, diaEjercicioId, pesoLogrado, repsLogradas }) {
  const sesion = await getOrCrearSesionHoy(dayId, alumnoId);
  const { error } = await supabase
    .from("registros")
    .upsert(
      { sesion_id: sesion.id, dia_ejercicio_id: diaEjercicioId, peso_logrado: pesoLogrado, reps_logradas: repsLogradas },
      { onConflict: "sesion_id,dia_ejercicio_id" }
    );
  if (error) throw error;
}

export async function guardarBorg({ dayId, alumnoId, valor }) {
  const sesion = await getOrCrearSesionHoy(dayId, alumnoId);
  const { error } = await supabase.from("sesiones").update({ esfuerzo_percibido_borg: valor }).eq("id", sesion.id);
  if (error) throw error;
}

export async function guardarDuracionSesion({ dayId, alumnoId, segundos }) {
  const sesion = await getOrCrearSesionHoy(dayId, alumnoId);
  const { error } = await supabase.from("sesiones").update({ duracion_segundos: segundos }).eq("id", sesion.id);
  if (error) throw error;
}

export async function agregarComentario({ diaEjercicioId, autorId, texto }) {
  const { data, error } = await supabase
    .from("comentarios")
    .insert({ dia_ejercicio_id: diaEjercicioId, autor_id: autorId, texto })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function guardarRM({ alumnoId, ejercicioId, pesoUsado, repsUsadas, rmEstimado }) {
  const { error } = await supabase.from("rm_registros").insert({
    alumno_id: alumnoId,
    ejercicio_id: ejercicioId,
    peso_usado: pesoUsado,
    reps_usadas: repsUsadas,
    rm_estimado: rmEstimado,
  });
  if (error) throw error;
}

async function buscarOCrearEjercicio(nombre) {
  const { data: existente, error: eB } = await supabase
    .from("ejercicios")
    .select("id")
    .ilike("nombre", nombre)
    .maybeSingle();
  if (eB) throw eB;
  if (existente) return existente.id;
  const { data: nuevo, error: eC } = await supabase.from("ejercicios").insert({ nombre }).select().single();
  if (eC) throw eC;
  return nuevo.id;
}

export async function agregarEjercicioADia({ dayId, nombre, series, reps, pesoObjetivo, descansoSeries, descansoPosterior }) {
  const ejercicioId = await buscarOCrearEjercicio(nombre);
  const { data, error } = await supabase
    .from("dia_ejercicios")
    .insert({
      dia_id: dayId,
      ejercicio_id: ejercicioId,
      series,
      reps,
      peso_objetivo: pesoObjetivo,
      descanso_series_seg: descansoSeries,
      descanso_posterior_seg: descansoPosterior,
    })
    .select("id, series, reps, peso_objetivo, descanso_series_seg, descanso_posterior_seg, ejercicios ( id, nombre, url_media )")
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarEjercicioDeDia(diaEjercicioId) {
  const { error } = await supabase.from("dia_ejercicios").delete().eq("id", diaEjercicioId);
  if (error) throw error;
}

async function crearRutinaSiNoExiste(alumnoId) {
  const { data: existente, error: eB } = await supabase
    .from("rutinas")
    .select("id")
    .eq("alumno_id", alumnoId)
    .eq("activa", true)
    .maybeSingle();
  if (eB) throw eB;
  if (existente) return existente.id;
  const { data: nueva, error: eC } = await supabase
    .from("rutinas")
    .insert({ alumno_id: alumnoId, nombre: "Rutina", activa: true })
    .select()
    .single();
  if (eC) throw eC;
  return nueva.id;
}

export async function agregarDia({ alumnoId, nombre, foco }) {
  const rutinaId = await crearRutinaSiNoExiste(alumnoId);
  const { data, error } = await supabase
    .from("dias")
    .insert({ rutina_id: rutinaId, nombre, foco })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// Crear un alumno nuevo desde la app (sin entrar a Supabase).
// Usa registrarAlumno (cliente auxiliar sin sesión persistida) de
// supabaseClient.js, así el signUp no toca tu sesión de profesor
// para nada — ni por un instante.
// ------------------------------------------------------------
function generarPasswordTemporal() {
  return Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-6);
}

export async function crearAlumno({ nombre, email }) {
  const password = generarPasswordTemporal();
  const { data, error } = await registrarAlumno({ email, password, nombre });
  if (error) throw error;
  return { alumnoId: data.user?.id, password };
}

// ------------------------------------------------------------
// Catálogo de ejercicios (reutilizable, con foto/video).
// ------------------------------------------------------------

export async function fetchCatalogoEjercicios() {
  const { data, error } = await supabase
    .from("ejercicios")
    .select("id, nombre, grupo_muscular, url_media")
    .order("nombre");
  if (error) throw error;
  return data || [];
}

export async function crearEjercicioCatalogo({ nombre, grupoMuscular }) {
  const { data, error } = await supabase
    .from("ejercicios")
    .insert({ nombre, grupo_muscular: grupoMuscular || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function agregarEjercicioADiaPorId({ dayId, ejercicioId, series, reps, pesoObjetivo, descansoSeries, descansoPosterior }) {
  const { data, error } = await supabase
    .from("dia_ejercicios")
    .insert({
      dia_id: dayId,
      ejercicio_id: ejercicioId,
      series,
      reps,
      peso_objetivo: pesoObjetivo,
      descanso_series_seg: descansoSeries,
      descanso_posterior_seg: descansoPosterior,
    })
    .select("id, series, reps, peso_objetivo, descanso_series_seg, descanso_posterior_seg, ejercicios ( id, nombre, url_media )")
    .single();
  if (error) throw error;
  return data;
}

export async function subirMediaEjercicio({ ejercicioId, file }) {
  const ext = file.name.split(".").pop();
  const path = `${ejercicioId}-${Date.now()}.${ext}`;
  const { error: upError } = await supabase.storage.from("ejercicios-media").upload(path, file, { upsert: true });
  if (upError) throw upError;
  const { data: urlData } = supabase.storage.from("ejercicios-media").getPublicUrl(path);
  const { data, error } = await supabase
    .from("ejercicios")
    .update({ url_media: urlData.publicUrl })
    .eq("id", ejercicioId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ------------------------------------------------------------
// Plantillas de rutina (reutilizables, sin alumno asignado
// hasta que se le "asignan" a uno).
// ------------------------------------------------------------

export async function fetchPlantillas() {
  const { data, error } = await supabase
    .from("rutinas")
    .select("id, nombre")
    .eq("es_plantilla", true)
    .order("nombre");
  if (error) throw error;
  return data || [];
}

export async function fetchDiasDePlantilla(rutinaId) {
  const { data: dias, error: eD } = await supabase
    .from("dias")
    .select("id, nombre, foco, orden")
    .eq("rutina_id", rutinaId)
    .order("orden");
  if (eD) throw eD;

  const result = [];
  for (const d of dias || []) {
    const { data: des, error: eDE } = await supabase
      .from("dia_ejercicios")
      .select("id, series, reps, peso_objetivo, descanso_series_seg, descanso_posterior_seg, orden, ejercicios ( id, nombre, url_media )")
      .eq("dia_id", d.id)
      .order("orden");
    if (eDE) throw eDE;
    result.push({
      dayId: d.id,
      day: d.nombre,
      focus: d.foco || "",
      exercises: (des || []).map((de) => ({
        id: de.id,
        catalogId: de.ejercicios?.id,
        name: de.ejercicios?.nombre || "Ejercicio",
        sets: de.series,
        reps: de.reps,
        targetWeight: de.peso_objetivo || "-",
        restSets: de.descanso_series_seg,
        restAfter: de.descanso_posterior_seg,
        mediaUrl: de.ejercicios?.url_media || null,
      })),
    });
  }
  return result;
}

export async function crearPlantilla({ nombre }) {
  const { data, error } = await supabase
    .from("rutinas")
    .insert({ alumno_id: null, nombre, activa: true, es_plantilla: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function agregarDiaAPlantilla({ rutinaId, nombre, foco }) {
  const { data, error } = await supabase
    .from("dias")
    .insert({ rutina_id: rutinaId, nombre, foco })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function asignarPlantillaAAlumno({ rutinaPlantillaId, alumnoId, nombreRutina }) {
  const dias = await fetchDiasDePlantilla(rutinaPlantillaId);

  await supabase.from("rutinas").update({ activa: false }).eq("alumno_id", alumnoId).eq("activa", true);

  const { data: nuevaRutina, error: eR } = await supabase
    .from("rutinas")
    .insert({ alumno_id: alumnoId, nombre: nombreRutina, activa: true, es_plantilla: false })
    .select()
    .single();
  if (eR) throw eR;

  const diasResultado = [];
  for (const d of dias) {
    const { data: nuevoDia, error: eD } = await supabase
      .from("dias")
      .insert({ rutina_id: nuevaRutina.id, nombre: d.day, foco: d.focus })
      .select()
      .single();
    if (eD) throw eD;

    const exercisesResultado = [];
    for (const ex of d.exercises) {
      const { data: nuevoDE, error: eDE } = await supabase
        .from("dia_ejercicios")
        .insert({
          dia_id: nuevoDia.id,
          ejercicio_id: ex.catalogId,
          series: ex.sets,
          reps: ex.reps,
          peso_objetivo: ex.targetWeight,
          descanso_series_seg: ex.restSets,
          descanso_posterior_seg: ex.restAfter,
        })
        .select("id, series, reps, peso_objetivo, descanso_series_seg, descanso_posterior_seg, ejercicios ( id, nombre, url_media )")
        .single();
      if (eDE) throw eDE;
      exercisesResultado.push(nuevoDE);
    }
    diasResultado.push({ dayId: nuevoDia.id, day: nuevoDia.nombre, focus: nuevoDia.foco || "", exercises: exercisesResultado });
  }

  return { rutina: nuevaRutina, dias: diasResultado };
}

export async function renombrarPlantilla({ rutinaId, nombre }) {
  const { data, error } = await supabase.from("rutinas").update({ nombre }).eq("id", rutinaId).select().single();
  if (error) throw error;
  return data;
}

export async function eliminarPlantilla(rutinaId) {
  const { error } = await supabase.from("rutinas").delete().eq("id", rutinaId);
  if (error) throw error;
}