import React, { useState, useEffect, useRef } from "react";
import { Users, User, Plus, Trash2, Check, Flame, ChevronRight, MessageSquare, Clock, Video, Send, Calculator, Play, Pause, RotateCcw, LogOut, Layers, Copy, Pencil, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase, obtenerUsuarioActual, cerrarSesion } from "./lib/supabaseClient";
import * as api from "./lib/api";
import Login from "./Login";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
`;

const COLORS = {
  bg: "#0E1013",
  surface: "#1A1D21",
  surface2: "#23272C",
  border: "#31363C",
  text: "#EDEDE7",
  dim: "#8B9096",
  accent: "#5B9BC7",
  accentDim: "#3E7BA3",
  danger: "#E24A3B",
};

const LOGO_ICON = "data:image/png;base64,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";

const mkExercise = (id, name, sets, reps, targetWeight, restSets, restAfter, mediaUrl, comments = []) => ({
  id, name, sets, reps, targetWeight, restSets, restAfter, mediaUrl,
  done: false, logWeight: "", logReps: "", showComments: false, comments,
});

const initialAlumnos = [
  {
    id: "a1",
    name: "Lucía Fernández",
    days: [
      {
        day: "Lunes",
        focus: "Pecho / Tríceps",
        exercises: [
          mkExercise("e1", "Press banca", 4, "8-10", "42 kg", 90, 120, "Video demostrativo", [
            { id: "c1", author: "profesor", authorName: "Vos", text: "Bajá controlado, 2 segundos de negativa." },
            { id: "c2", author: "alumno", authorName: "Lucía", text: "Me costó la última serie, ¿bajo el peso el próximo lunes?" },
          ]),
          mkExercise("e2", "Press inclinado mancuernas", 3, "10-12", "16 kg", 60, 90, "Foto de referencia"),
          mkExercise("e3", "Fondos en paralelas", 3, "10", "PC", 60, 90, "Video demostrativo"),
        ],
      },
      {
        day: "Miércoles",
        focus: "Espalda / Bíceps",
        exercises: [
          mkExercise("e4", "Dominadas", 4, "6-8", "PC", 90, 120, "Video demostrativo"),
          mkExercise("e5", "Remo con barra", 4, "8-10", "50 kg", 90, 120, "Foto de referencia"),
        ],
      },
      {
        day: "Viernes",
        focus: "Piernas",
        exercises: [
          mkExercise("e6", "Sentadilla", 4, "6-8", "60 kg", 120, 150, "Video demostrativo"),
          mkExercise("e7", "Prensa", 3, "10-12", "120 kg", 90, 120, "Foto de referencia"),
        ],
      },
    ],
  },
  {
    id: "a2",
    name: "Martín Ríos",
    days: [
      {
        day: "Lunes",
        focus: "Full Body",
        exercises: [
          mkExercise("e8", "Sentadilla", 4, "5", "80 kg", 120, 150, "Video demostrativo"),
          mkExercise("e9", "Press militar", 3, "8", "35 kg", 90, 120, "Foto de referencia"),
        ],
      },
    ],
  },
  {
    id: "a3",
    name: "Sofía Gómez",
    days: [
      {
        day: "Martes",
        focus: "Glúteo / Femoral",
        exercises: [
          mkExercise("e10", "Hip thrust", 4, "10-12", "70 kg", 60, 90, "Video demostrativo"),
          mkExercise("e11", "Peso muerto rumano", 3, "10", "40 kg", 90, 120, "Foto de referencia"),
        ],
      },
    ],
  },
];
initialAlumnos.forEach((a) => a.days.forEach((d) => { d.rpeBorg = null; }));

const BORG_LEVELS = [
  { min: 6, max: 8, label: "Sin esfuerzo / muy leve" },
  { min: 9, max: 10, label: "Muy leve" },
  { min: 11, max: 12, label: "Leve" },
  { min: 13, max: 14, label: "Algo intenso" },
  { min: 15, max: 16, label: "Intenso" },
  { min: 17, max: 18, label: "Muy intenso" },
  { min: 19, max: 20, label: "Esfuerzo máximo" },
];

function borgLabel(v) {
  const found = BORG_LEVELS.find((l) => v >= l.min && v <= l.max);
  return found ? found.label : "";
}

function borgColor(v) {
  if (v <= 10) return "#5B9BC7";
  if (v <= 14) return "#9FD62E";
  if (v <= 17) return "#F2A623";
  return "#E24A3B";
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function BarbellProgress({ pct }) {
  const plateCount = Math.round((pct / 100) * 6);
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 10, height: 10, borderRadius: 9999, background: COLORS.border }} />
      <div className="flex-1 flex items-center" style={{ height: 6, background: COLORS.border, borderRadius: 3, position: "relative" }}>
        <div style={{ width: `${pct}%`, height: 6, background: COLORS.accent, borderRadius: 3, transition: "width 300ms ease" }} />
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: i < plateCount ? 22 : 14,
              background: i < plateCount ? COLORS.accent : COLORS.border,
              borderRadius: 1,
              transition: "all 250ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MediaBox({ url }) {
  if (!url) {
    return (
      <div
        className="flex items-center gap-2 px-2.5 py-2 rounded-md"
        style={{ background: COLORS.surface2, border: `1px dashed ${COLORS.border}`, width: "fit-content" }}
      >
        <Video size={14} color={COLORS.dim} />
        <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Sin media</span>
      </div>
    );
  }
  const esVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
  return (
    <div className="rounded-md overflow-hidden" style={{ width: 180, border: `1px solid ${COLORS.border}` }}>
      {esVideo ? (
        <video src={url} controls style={{ width: "100%", display: "block", maxHeight: 160 }} />
      ) : (
        <img src={url} alt="Demostración del ejercicio" style={{ width: "100%", display: "block", maxHeight: 160, objectFit: "cover" }} />
      )}
    </div>
  );
}

function CommentsPanel({ exercise, onAddComment, currentAuthor, currentAuthorName }) {
  const [draft, setDraft] = useState("");
  const submit = () => {
    if (!draft.trim()) return;
    onAddComment(exercise.id, { id: `c${Date.now()}`, author: currentAuthor, authorName: currentAuthorName, text: draft });
    setDraft("");
  };
  return (
    <div className="flex flex-col gap-2 mt-2" style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
      {exercise.comments.length === 0 && (
        <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay comentarios en este ejercicio.</span>
      )}
      {exercise.comments.map((c) => (
        <div key={c.id} className="flex flex-col" style={{ maxWidth: "90%" }}>
          <span
            style={{
              fontFamily: "Inter", fontSize: 11, fontWeight: 600,
              color: c.author === "profesor" ? COLORS.accent : COLORS.dim,
            }}
          >
            {c.authorName}
          </span>
          <span
            className="px-2.5 py-1.5 rounded-md mt-0.5"
            style={{
              fontFamily: "Inter", fontSize: 13, color: COLORS.text,
              background: c.author === "profesor" ? "rgba(91,155,199,0.12)" : COLORS.surface2,
              border: `1px solid ${c.author === "profesor" ? COLORS.accentDim : COLORS.border}`,
            }}
          >
            {c.text}
          </span>
        </div>
      ))}
      <div className="flex gap-2 mt-1">
        <input
          value={draft}
          onChange={(ev) => setDraft(ev.target.value)}
          onKeyDown={(ev) => ev.key === "Enter" && submit()}
          placeholder={currentAuthor === "profesor" ? "Escribir una indicación..." : "Dejar tu feedback..."}
          style={{ flex: 1, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
        />
        <button onClick={submit} style={{ background: COLORS.accent, borderRadius: 6, padding: "6px 10px", display: "flex", alignItems: "center" }}>
          <Send size={14} color="#101215" />
        </button>
      </div>
    </div>
  );
}

function CatalogoManager({ catalogo, setCatalogo }) {
  const [newEjercicio, setNewEjercicio] = useState({ nombre: "", grupoMuscular: "" });
  const [creando, setCreando] = useState(false);
  const [subiendoId, setSubiendoId] = useState(null);

  const crear = async () => {
    if (!newEjercicio.nombre.trim()) return;
    setCreando(true);
    try {
      const nuevo = await api.crearEjercicioCatalogo({ nombre: newEjercicio.nombre, grupoMuscular: newEjercicio.grupoMuscular });
      setCatalogo((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setNewEjercicio({ nombre: "", grupoMuscular: "" });
    } catch (err) {
      alert("No se pudo crear el ejercicio: " + err.message);
    } finally {
      setCreando(false);
    }
  };

  const subirMedia = async (ejercicioId, file) => {
    if (!file) return;
    setSubiendoId(ejercicioId);
    try {
      const actualizado = await api.subirMediaEjercicio({ ejercicioId, file });
      setCatalogo((prev) => prev.map((e) => (e.id === ejercicioId ? { ...e, url_media: actualizado.url_media } : e)));
    } catch (err) {
      alert("No se pudo subir el archivo: " + err.message);
    } finally {
      setSubiendoId(null);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar ejercicio al catálogo</div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Nombre (ej: Curl de bíceps)"
            value={newEjercicio.nombre}
            onChange={(ev) => setNewEjercicio({ ...newEjercicio, nombre: ev.target.value })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 180px" }}
          />
          <input
            placeholder="Grupo muscular (opcional)"
            value={newEjercicio.grupoMuscular}
            onChange={(ev) => setNewEjercicio({ ...newEjercicio, grupoMuscular: ev.target.value })}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 160px" }}
          />
          <button
            onClick={crear}
            disabled={creando}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md"
            style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creando ? 0.6 : 1 }}
          >
            <Plus size={14} /> {creando ? "Creando..." : "Agregar"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {catalogo.length === 0 && (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Todavía no tenés ejercicios en el catálogo.</span>
        )}
        {catalogo.map((e) => (
          <div key={e.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{e.nombre}</div>
                {e.grupo_muscular && (
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginTop: 2 }}>{e.grupo_muscular}</div>
                )}
                <label
                  className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-md cursor-pointer"
                  style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                >
                  <Video size={12} />
                  {subiendoId === e.id ? "Subiendo..." : e.url_media ? "Reemplazar foto/video" : "Subir foto o video"}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    disabled={subiendoId === e.id}
                    onChange={(ev) => subirMedia(e.id, ev.target.files?.[0])}
                  />
                </label>
              </div>
              <MediaBox url={e.url_media} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlantillasManager({ alumnos, setAlumnos, catalogo }) {
  const [plantillas, setPlantillas] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [nuevaPlantilla, setNuevaPlantilla] = useState("");
  const [creandoPlantilla, setCreandoPlantilla] = useState(false);
  const [diasPlantilla, setDiasPlantilla] = useState([]);
  const [cargandoDias, setCargandoDias] = useState(false);
  const [newDay, setNewDay] = useState({ nombre: "", foco: "" });
  const [creandoDia, setCreandoDia] = useState(false);
  const [newExercise, setNewExercise] = useState({ dayIdx: 0, ejercicioId: "__nuevo__", nuevoNombre: "", sets: "3", reps: "10", targetWeight: "", restSets: "60", restAfter: "90" });
  const [asignarAlumnoId, setAsignarAlumnoId] = useState("");
  const [asignando, setAsignando] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreEdit, setNombreEdit] = useState("");
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    setEditandoNombre(false);
  }, [selectedId]);

  useEffect(() => {
    api.fetchPlantillas().then(setPlantillas).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) { setDiasPlantilla([]); return; }
    setCargandoDias(true);
    api.fetchDiasDePlantilla(selectedId).then(setDiasPlantilla).catch(() => {}).finally(() => setCargandoDias(false));
  }, [selectedId]);

  const selected = plantillas.find((p) => p.id === selectedId);

  const crear = async () => {
    if (!nuevaPlantilla.trim()) return;
    setCreandoPlantilla(true);
    try {
      const nueva = await api.crearPlantilla({ nombre: nuevaPlantilla });
      setPlantillas((prev) => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setSelectedId(nueva.id);
      setNuevaPlantilla("");
    } catch (err) {
      alert("No se pudo crear la plantilla: " + err.message);
    } finally {
      setCreandoPlantilla(false);
    }
  };

  const crearDia = async () => {
    if (!newDay.nombre.trim() || !selectedId) return;
    setCreandoDia(true);
    try {
      const dia = await api.agregarDiaAPlantilla({ rutinaId: selectedId, nombre: newDay.nombre, foco: newDay.foco });
      setDiasPlantilla((prev) => [...prev, { dayId: dia.id, day: dia.nombre, focus: dia.foco || "", exercises: [] }]);
      setNewDay({ nombre: "", foco: "" });
    } catch (err) {
      alert("No se pudo crear el día: " + err.message);
    } finally {
      setCreandoDia(false);
    }
  };

  const addExercise = async () => {
    const usandoNuevo = newExercise.ejercicioId === "__nuevo__";
    if (usandoNuevo && !newExercise.nuevoNombre.trim()) return;
    if (diasPlantilla.length === 0) return;
    const day = diasPlantilla[newExercise.dayIdx];
    try {
      const nuevo = usandoNuevo
        ? await api.agregarEjercicioADia({
            dayId: day.dayId,
            nombre: newExercise.nuevoNombre,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          })
        : await api.agregarEjercicioADiaPorId({
            dayId: day.dayId,
            ejercicioId: newExercise.ejercicioId,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          });
      const exObj = {
        id: nuevo.id,
        catalogId: nuevo.ejercicios?.id,
        name: nuevo.ejercicios?.nombre || newExercise.nuevoNombre,
        sets: nuevo.series,
        reps: nuevo.reps,
        targetWeight: nuevo.peso_objetivo,
        restSets: nuevo.descanso_series_seg,
        restAfter: nuevo.descanso_posterior_seg,
        mediaUrl: nuevo.ejercicios?.url_media || null,
      };
      setDiasPlantilla((prev) =>
        prev.map((d, idx) => (idx === newExercise.dayIdx ? { ...d, exercises: [...d.exercises, exObj] } : d))
      );
      setNewExercise({ ...newExercise, nuevoNombre: "", targetWeight: "" });
    } catch (err) {
      alert("No se pudo agregar el ejercicio: " + err.message);
    }
  };

  const asignar = async () => {
    if (!asignarAlumnoId || !selected) return;
    setAsignando(true);
    try {
      const { rutina, dias } = await api.asignarPlantillaAAlumno({
        rutinaPlantillaId: selectedId,
        alumnoId: asignarAlumnoId,
        nombreRutina: selected.nombre,
      });
      const nuevosDias = dias.map((d) => ({
        day: d.day,
        focus: d.focus,
        dayId: d.dayId,
        rpeBorg: null,
        exercises: d.exercises.map((ex) =>
          mkExercise(ex.id, ex.ejercicios?.nombre, ex.series, ex.reps, ex.peso_objetivo, ex.descanso_series_seg, ex.descanso_posterior_seg, ex.ejercicios?.url_media || null)
        ),
      }));
      setAlumnos((prev) => prev.map((a) => (a.id === asignarAlumnoId ? { ...a, rutinaId: rutina.id, days: nuevosDias } : a)));
      alert("Rutina asignada correctamente.");
      setAsignarAlumnoId("");
    } catch (err) {
      alert("No se pudo asignar la plantilla: " + err.message);
    } finally {
      setAsignando(false);
    }
  };

  const guardarNombre = async () => {
    if (!nombreEdit.trim() || !selectedId) return;
    setGuardandoNombre(true);
    try {
      const actualizado = await api.renombrarPlantilla({ rutinaId: selectedId, nombre: nombreEdit });
      setPlantillas((prev) =>
        prev.map((p) => (p.id === selectedId ? { ...p, nombre: actualizado.nombre } : p)).sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
      setEditandoNombre(false);
    } catch (err) {
      alert("No se pudo renombrar la plantilla: " + err.message);
    } finally {
      setGuardandoNombre(false);
    }
  };

  const eliminarPlantillaActual = async () => {
    if (!selectedId || !selected) return;
    if (!confirm(`¿Borrar la plantilla "${selected.nombre}"? Esto no afecta a los alumnos que ya la tengan asignada, solo elimina la plantilla en sí.`)) return;
    setEliminando(true);
    try {
      await api.eliminarPlantilla(selectedId);
      setPlantillas((prev) => prev.filter((p) => p.id !== selectedId));
      setSelectedId(null);
    } catch (err) {
      alert("No se pudo borrar la plantilla: " + err.message);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="flex gap-6 w-full" style={{ minHeight: 480 }}>
      <div className="w-56 shrink-0">
        <div className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: COLORS.dim, fontFamily: "Inter" }}>
          <Layers size={14} /> Plantillas
        </div>
        <div className="flex flex-col gap-1">
          {plantillas.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-colors"
              style={{
                background: selectedId === p.id ? COLORS.surface2 : "transparent",
                border: `1px solid ${selectedId === p.id ? COLORS.accent : "transparent"}`,
                color: selectedId === p.id ? COLORS.text : COLORS.dim,
              }}
            >
              <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 500 }}>{p.nombre}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 8 }}>Crear plantilla</div>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Nombre (ej: Hipertrofia 4 días)"
              value={nuevaPlantilla}
              onChange={(ev) => setNuevaPlantilla(ev.target.value)}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, boxSizing: "border-box" }}
            />
            <button
              onClick={crear}
              disabled={creandoPlantilla}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md"
              style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoPlantilla ? 0.6 : 1 }}
            >
              <Plus size={14} /> {creandoPlantilla ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {!selected ? (
          <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Creá o seleccioná una plantilla para editarla.
          </div>
        ) : (
        <>
        {editandoNombre ? (
          <div className="flex items-center gap-2">
            <input
              value={nombreEdit}
              onChange={(ev) => setNombreEdit(ev.target.value)}
              autoFocus
              style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.accent}`, borderRadius: 6, padding: "6px 10px", fontFamily: "Inter", fontSize: 18, fontWeight: 600 }}
            />
            <button
              onClick={guardarNombre}
              disabled={guardandoNombre}
              className="px-3 py-1.5 rounded-md"
              style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: guardandoNombre ? 0.6 : 1 }}
            >
              {guardandoNombre ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => setEditandoNombre(false)}
              className="px-3 py-1.5 rounded-md"
              style={{ background: COLORS.surface2, color: COLORS.dim, fontFamily: "Inter", fontSize: 13 }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 1, color: COLORS.text }}>{selected.nombre}</div>
            <button
              onClick={() => { setNombreEdit(selected.nombre); setEditandoNombre(true); }}
              style={{ color: COLORS.dim }}
              title="Renombrar"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={eliminarPlantillaActual}
              disabled={eliminando}
              style={{ color: COLORS.danger, opacity: eliminando ? 0.6 : 1 }}
              title="Borrar plantilla"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5 p-3 rounded-md" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
          <Copy size={14} color={COLORS.accent} />
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Asignar esta plantilla a:</span>
          <select
            value={asignarAlumnoId}
            onChange={(ev) => setAsignarAlumnoId(ev.target.value)}
            style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
          >
            <option value="">Elegir alumno...</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={asignar}
            disabled={asignando || !asignarAlumnoId}
            className="px-3 py-1.5 rounded-md"
            style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: asignando || !asignarAlumnoId ? 0.6 : 1 }}
          >
            {asignando ? "Asignando..." : "Asignar"}
          </button>
        </div>

        {cargandoDias ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando días...</span>
        ) : (
        <div className="flex flex-col gap-5">
          {diasPlantilla.map((d, dayIdx) => (
            <div key={d.dayId} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div className="flex items-baseline gap-2 mb-3">
                <span style={{ fontFamily: "Bebas Neue", fontSize: 18, color: COLORS.accent, letterSpacing: 1 }}>{d.day}</span>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>{d.focus}</span>
              </div>
              <div className="flex flex-col gap-2">
                {d.exercises.map((e) => (
                  <div key={e.id} className="rounded-md px-3 py-2" style={{ background: COLORS.surface2 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.text }}>{e.name}</span>
                      <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim }}>
                        {e.sets}×{e.reps} · {e.targetWeight}
                      </span>
                    </div>
                    <div className="mt-2">
                      <MediaBox url={e.mediaUrl} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {diasPlantilla.length > 0 && (
            <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar ejercicio</div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={newExercise.dayIdx}
                  onChange={(ev) => setNewExercise({ ...newExercise, dayIdx: Number(ev.target.value) })}
                  style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                >
                  {diasPlantilla.map((d, idx) => (
                    <option key={d.dayId} value={idx}>{d.day}</option>
                  ))}
                </select>
                <select
                  value={newExercise.ejercicioId}
                  onChange={(ev) => setNewExercise({ ...newExercise, ejercicioId: ev.target.value })}
                  style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 180px" }}
                >
                  <option value="__nuevo__">+ Nuevo ejercicio...</option>
                  {catalogo.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
                {newExercise.ejercicioId === "__nuevo__" && (
                  <input
                    placeholder="Nombre del ejercicio nuevo"
                    value={newExercise.nuevoNombre}
                    onChange={(ev) => setNewExercise({ ...newExercise, nuevoNombre: ev.target.value })}
                    style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 160px" }}
                  />
                )}
                <input
                  placeholder="Series"
                  value={newExercise.sets}
                  onChange={(ev) => setNewExercise({ ...newExercise, sets: ev.target.value })}
                  style={{ width: 60, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Reps"
                  value={newExercise.reps}
                  onChange={(ev) => setNewExercise({ ...newExercise, reps: ev.target.value })}
                  style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Peso objetivo"
                  value={newExercise.targetWeight}
                  onChange={(ev) => setNewExercise({ ...newExercise, targetWeight: ev.target.value })}
                  style={{ width: 100, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Descanso series (s)"
                  value={newExercise.restSets}
                  onChange={(ev) => setNewExercise({ ...newExercise, restSets: ev.target.value })}
                  style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <input
                  placeholder="Descanso post (s)"
                  value={newExercise.restAfter}
                  onChange={(ev) => setNewExercise({ ...newExercise, restAfter: ev.target.value })}
                  style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
                />
                <button
                  onClick={addExercise}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                  style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>
            </div>
          )}

          <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar día</div>
            <div className="flex flex-wrap gap-2">
              <input
                placeholder="Nombre del día (ej: Lunes)"
                value={newDay.nombre}
                onChange={(ev) => setNewDay({ ...newDay, nombre: ev.target.value })}
                style={{ width: 200, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Foco (ej: Pecho / Tríceps)"
                value={newDay.foco}
                onChange={(ev) => setNewDay({ ...newDay, foco: ev.target.value })}
                style={{ width: 220, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <button
                onClick={crearDia}
                disabled={creandoDia}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoDia ? 0.6 : 1 }}
              >
                <Plus size={14} /> {creandoDia ? "Creando..." : "Agregar día"}
              </button>
            </div>
          </div>
        </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}

function ProfesorView({ alumnos, setAlumnos, usuario }) {
  const [section, setSection] = useState("alumnos");
  const [selectedId, setSelectedId] = useState(alumnos[0]?.id);
  const [newExercise, setNewExercise] = useState({ dayIdx: 0, ejercicioId: "__nuevo__", nuevoNombre: "", sets: "3", reps: "10", targetWeight: "", restSets: "60", restAfter: "90" });
  const [newAlumno, setNewAlumno] = useState({ nombre: "", email: "" });
  const [creandoAlumno, setCreandoAlumno] = useState(false);
  const [credencialesNuevoAlumno, setCredencialesNuevoAlumno] = useState(null);
  const [newDay, setNewDay] = useState({ nombre: "", foco: "" });
  const [creandoDia, setCreandoDia] = useState(false);
  const [catalogo, setCatalogo] = useState([]);
  const [vistaAlumno, setVistaAlumno] = useState("rutina");
  const selected = alumnos.find((a) => a.id === selectedId);

  useEffect(() => {
    api.fetchCatalogoEjercicios().then(setCatalogo).catch(() => {});
  }, []);

  const crearAlumno = async () => {
    if (!newAlumno.nombre.trim() || !newAlumno.email.trim()) return;
    setCreandoAlumno(true);
    try {
      const { alumnoId, password } = await api.crearAlumno({ nombre: newAlumno.nombre, email: newAlumno.email });
      setAlumnos((prev) => [...prev, { id: alumnoId, name: newAlumno.nombre, rutinaId: null, days: [] }]);
      setCredencialesNuevoAlumno({ email: newAlumno.email, password });
      setNewAlumno({ nombre: "", email: "" });
    } catch (err) {
      alert("No se pudo crear el alumno: " + err.message);
    } finally {
      setCreandoAlumno(false);
    }
  };

  const crearDia = async () => {
    if (!newDay.nombre.trim() || !selected) return;
    setCreandoDia(true);
    try {
      const dia = await api.agregarDia({ alumnoId: selected.id, nombre: newDay.nombre, foco: newDay.foco });
      setAlumnos((prev) =>
        prev.map((a) =>
          a.id !== selected.id
            ? a
            : { ...a, days: [...a.days, { day: dia.nombre, focus: dia.foco || "", dayId: dia.id, rpeBorg: null, exercises: [] }] }
        )
      );
      setNewDay({ nombre: "", foco: "" });
    } catch (err) {
      alert("No se pudo crear el día: " + err.message);
    } finally {
      setCreandoDia(false);
    }
  };

  const addExercise = async () => {
    const usandoNuevo = newExercise.ejercicioId === "__nuevo__";
    if (usandoNuevo && !newExercise.nuevoNombre.trim()) return;
    if (!selected) return;
    const day = selected.days[newExercise.dayIdx];
    try {
      const nuevo = usandoNuevo
        ? await api.agregarEjercicioADia({
            dayId: day.dayId,
            nombre: newExercise.nuevoNombre,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          })
        : await api.agregarEjercicioADiaPorId({
            dayId: day.dayId,
            ejercicioId: newExercise.ejercicioId,
            series: Number(newExercise.sets) || 1,
            reps: newExercise.reps,
            pesoObjetivo: newExercise.targetWeight || "-",
            descansoSeries: Number(newExercise.restSets) || 60,
            descansoPosterior: Number(newExercise.restAfter) || 90,
          });
      if (usandoNuevo && nuevo.ejercicios) {
        setCatalogo((prev) =>
          prev.find((e) => e.id === nuevo.ejercicios.id)
            ? prev
            : [...prev, { id: nuevo.ejercicios.id, nombre: nuevo.ejercicios.nombre, url_media: nuevo.ejercicios.url_media }].sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      }
      const exerciseObj = mkExercise(
        nuevo.id,
        nuevo.ejercicios?.nombre || newExercise.nuevoNombre,
        nuevo.series,
        nuevo.reps,
        nuevo.peso_objetivo,
        nuevo.descanso_series_seg,
        nuevo.descanso_posterior_seg,
        nuevo.ejercicios?.url_media || null
      );
      exerciseObj.catalogId = nuevo.ejercicios?.id;
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== selectedId) return a;
          const days = a.days.map((d, idx) =>
            idx === newExercise.dayIdx ? { ...d, exercises: [...d.exercises, exerciseObj] } : d
          );
          return { ...a, days };
        })
      );
      setNewExercise({ ...newExercise, nuevoNombre: "", targetWeight: "" });
    } catch (err) {
      alert("No se pudo agregar el ejercicio: " + err.message);
    }
  };

  const removeExercise = async (dayIdx, exId) => {
    try {
      await api.eliminarEjercicioDeDia(exId);
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== selectedId) return a;
          const days = a.days.map((d, idx) =>
            idx === dayIdx ? { ...d, exercises: d.exercises.filter((e) => e.id !== exId) } : d
          );
          return { ...a, days };
        })
      );
    } catch (err) {
      alert("No se pudo borrar el ejercicio: " + err.message);
    }
  };

  const toggleComments = (dayIdx, exId) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== selectedId) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, showComments: !e.showComments } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
  };

  const addComment = async (dayIdx, exId, comment) => {
    try {
      const guardado = await api.agregarComentario({ diaEjercicioId: exId, autorId: usuario.id, texto: comment.text });
      const comentarioReal = { id: guardado.id, author: "profesor", authorName: usuario.nombre, text: comment.text };
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== selectedId) return a;
          const days = a.days.map((d, idx) =>
            idx === dayIdx
              ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, comments: [...e.comments, comentarioReal] } : e)) }
              : d
          );
          return { ...a, days };
        })
      );
    } catch (err) {
      alert("No se pudo guardar el comentario: " + err.message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-1 p-1 rounded-full mb-6" style={{ background: COLORS.surface, width: "fit-content" }}>
        <button
          onClick={() => setSection("alumnos")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "alumnos" ? COLORS.accent : "transparent",
            color: section === "alumnos" ? "#101215" : COLORS.dim,
          }}
        >
          <Users size={14} /> Mis alumnos
        </button>
        <button
          onClick={() => setSection("plantillas")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "plantillas" ? COLORS.accent : "transparent",
            color: section === "plantillas" ? "#101215" : COLORS.dim,
          }}
        >
          <Layers size={14} /> Plantillas
        </button>
        <button
          onClick={() => setSection("catalogo")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "catalogo" ? COLORS.accent : "transparent",
            color: section === "catalogo" ? "#101215" : COLORS.dim,
          }}
        >
          <Video size={14} /> Catálogo de ejercicios
        </button>
      </div>

      {section === "catalogo" ? (
        <CatalogoManager catalogo={catalogo} setCatalogo={setCatalogo} />
      ) : section === "plantillas" ? (
        <PlantillasManager alumnos={alumnos} setAlumnos={setAlumnos} catalogo={catalogo} />
      ) : (
    <div className="flex gap-6 w-full" style={{ minHeight: 480 }}>
      <div className="w-56 shrink-0">
        <div className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: COLORS.dim, fontFamily: "Inter" }}>
          <Users size={14} /> Alumnos
        </div>
        <div className="flex flex-col gap-1">
          {alumnos.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className="text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-colors"
              style={{
                background: selectedId === a.id ? COLORS.surface2 : "transparent",
                border: `1px solid ${selectedId === a.id ? COLORS.accent : "transparent"}`,
                color: selectedId === a.id ? COLORS.text : COLORS.dim,
              }}
            >
              <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 500 }}>{a.name}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 8 }}>Agregar alumno</div>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Nombre"
              value={newAlumno.nombre}
              onChange={(ev) => setNewAlumno({ ...newAlumno, nombre: ev.target.value })}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, boxSizing: "border-box" }}
            />
            <input
              placeholder="Email"
              value={newAlumno.email}
              onChange={(ev) => setNewAlumno({ ...newAlumno, email: ev.target.value })}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, boxSizing: "border-box" }}
            />
            <button
              onClick={crearAlumno}
              disabled={creandoAlumno}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md"
              style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoAlumno ? 0.6 : 1 }}
            >
              <Plus size={14} /> {creandoAlumno ? "Creando..." : "Crear"}
            </button>
          </div>
          {credencialesNuevoAlumno && (
            <div className="mt-3 px-3 py-2 rounded-md" style={{ background: COLORS.surface2, border: `1px solid ${COLORS.accent}` }}>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim }}>Compartile al alumno:</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.text, marginTop: 4 }}>{credencialesNuevoAlumno.email}</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.accent }}>{credencialesNuevoAlumno.password}</div>
              <div style={{ fontFamily: "Inter", fontSize: 10, color: COLORS.dim, marginTop: 4 }}>
                Debe confirmar su email antes de poder entrar.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        {!selected ? (
          <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Creá tu primer alumno con el formulario de la izquierda para empezar.
          </div>
        ) : (
        <>
        <div className="flex items-center gap-3 mb-4">
          <div style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 1, color: COLORS.text }}>{selected.name}</div>
          <div className="flex gap-1 p-1 rounded-full" style={{ background: COLORS.surface }}>
            <button
              onClick={() => setVistaAlumno("rutina")}
              className="px-3 py-1 rounded-full"
              style={{
                fontFamily: "Inter", fontSize: 12, fontWeight: 600,
                background: vistaAlumno === "rutina" ? COLORS.accent : "transparent",
                color: vistaAlumno === "rutina" ? "#101215" : COLORS.dim,
              }}
            >
              Rutina
            </button>
            <button
              onClick={() => setVistaAlumno("progreso")}
              className="px-3 py-1 rounded-full flex items-center gap-1"
              style={{
                fontFamily: "Inter", fontSize: 12, fontWeight: 600,
                background: vistaAlumno === "progreso" ? COLORS.accent : "transparent",
                color: vistaAlumno === "progreso" ? "#101215" : COLORS.dim,
              }}
            >
              <TrendingUp size={12} /> Progreso
            </button>
          </div>
        </div>
        {vistaAlumno === "progreso" ? (
          <ProgresoView alumnoId={selected.id} />
        ) : (
        <>
        <div className="mt-4 flex flex-col gap-5">
          {selected.days.map((d, dayIdx) => (
            <div key={d.day} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div className="flex items-baseline gap-2 mb-3">
                <span style={{ fontFamily: "Bebas Neue", fontSize: 18, color: COLORS.accent, letterSpacing: 1 }}>{d.day}</span>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>{d.focus}</span>
                {d.rpeBorg !== null && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full ml-auto"
                    style={{ background: `${borgColor(d.rpeBorg)}22`, border: `1px solid ${borgColor(d.rpeBorg)}` }}
                  >
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700, color: borgColor(d.rpeBorg) }}>{d.rpeBorg}</span>
                    <span style={{ fontFamily: "Inter", fontSize: 11, color: borgColor(d.rpeBorg) }}>{borgLabel(d.rpeBorg)}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {d.exercises.map((e) => (
                  <div key={e.id} className="rounded-md px-3 py-2" style={{ background: COLORS.surface2 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "Inter", fontSize: 14, color: COLORS.text }}>{e.name}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim }}>
                          {e.sets}×{e.reps} · {e.targetWeight}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: COLORS.dim }}>
                          <Clock size={11} /> {e.restSets}s / {e.restAfter}s
                        </span>
                        <button onClick={() => toggleComments(dayIdx, e.id)} className="flex items-center gap-1" style={{ color: e.comments.length ? COLORS.accent : COLORS.dim }}>
                          <MessageSquare size={14} />
                          {e.comments.length > 0 && <span style={{ fontFamily: "JetBrains Mono", fontSize: 11 }}>{e.comments.length}</span>}
                        </button>
                        <button onClick={() => removeExercise(dayIdx, e.id)} style={{ color: COLORS.dim }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <MediaBox url={e.mediaUrl} />
                    </div>
                    {e.showComments && (
                      <CommentsPanel exercise={e} onAddComment={(exId, c) => addComment(dayIdx, exId, c)} currentAuthor="profesor" currentAuthorName="Vos" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar ejercicio</div>
            <div className="flex flex-wrap gap-2">
              <select
                value={newExercise.dayIdx}
                onChange={(ev) => setNewExercise({ ...newExercise, dayIdx: Number(ev.target.value) })}
                style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              >
                {selected.days.map((d, idx) => (
                  <option key={d.day} value={idx}>{d.day}</option>
                ))}
              </select>
              <select
                value={newExercise.ejercicioId}
                onChange={(ev) => setNewExercise({ ...newExercise, ejercicioId: ev.target.value })}
                style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 180px" }}
              >
                <option value="__nuevo__">+ Nuevo ejercicio...</option>
                {catalogo.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
              {newExercise.ejercicioId === "__nuevo__" && (
                <input
                  placeholder="Nombre del ejercicio nuevo"
                  value={newExercise.nuevoNombre}
                  onChange={(ev) => setNewExercise({ ...newExercise, nuevoNombre: ev.target.value })}
                  style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13, flex: "1 1 160px" }}
                />
              )}
              <input
                placeholder="Series"
                value={newExercise.sets}
                onChange={(ev) => setNewExercise({ ...newExercise, sets: ev.target.value })}
                style={{ width: 60, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Reps"
                value={newExercise.reps}
                onChange={(ev) => setNewExercise({ ...newExercise, reps: ev.target.value })}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Peso objetivo"
                value={newExercise.targetWeight}
                onChange={(ev) => setNewExercise({ ...newExercise, targetWeight: ev.target.value })}
                style={{ width: 100, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Descanso series (s)"
                value={newExercise.restSets}
                onChange={(ev) => setNewExercise({ ...newExercise, restSets: ev.target.value })}
                style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Descanso post (s)"
                value={newExercise.restAfter}
                onChange={(ev) => setNewExercise({ ...newExercise, restAfter: ev.target.value })}
                style={{ width: 130, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <button
                onClick={addExercise}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600 }}
              >
                <Plus size={14} /> Agregar
              </button>
            </div>
          </div>

          <div style={{ background: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 10 }}>Agregar día de entrenamiento</div>
            <div className="flex flex-wrap gap-2">
              <input
                placeholder="Nombre del día (ej: Miércoles)"
                value={newDay.nombre}
                onChange={(ev) => setNewDay({ ...newDay, nombre: ev.target.value })}
                style={{ width: 200, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <input
                placeholder="Foco (ej: Espalda / Bíceps)"
                value={newDay.foco}
                onChange={(ev) => setNewDay({ ...newDay, foco: ev.target.value })}
                style={{ width: 220, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "Inter", fontSize: 13 }}
              />
              <button
                onClick={crearDia}
                disabled={creandoDia}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md"
                style={{ background: COLORS.accent, color: "#101215", fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: creandoDia ? 0.6 : 1 }}
              >
                <Plus size={14} /> {creandoDia ? "Creando..." : "Agregar día"}
              </button>
            </div>
          </div>
        </div>
        </>
        )}
        </>
        )}
      </div>
    </div>
      )}
    </div>
  );
}

function ProgresoView({ alumnoId }) {
  const [historialRM, setHistorialRM] = useState([]);
  const [historialSesiones, setHistorialSesiones] = useState([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    Promise.all([api.fetchHistorialRM(alumnoId), api.fetchHistorialSesiones(alumnoId)])
      .then(([rm, sesiones]) => {
        setHistorialRM(rm);
        setHistorialSesiones(sesiones);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [alumnoId]);

  const ejerciciosConRM = [];
  historialRM.forEach((r) => {
    if (!ejerciciosConRM.find((e) => e.id === r.ejercicio_id)) {
      ejerciciosConRM.push({ id: r.ejercicio_id, nombre: r.ejercicios?.nombre || "Ejercicio" });
    }
  });

  useEffect(() => {
    if (ejerciciosConRM.length > 0 && !ejercicioSeleccionado) {
      setEjercicioSeleccionado(ejerciciosConRM[0].id);
    }
  }, [historialRM]);

  const formatFecha = (f) => new Date(f).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });

  const datosRM = historialRM
    .filter((r) => r.ejercicio_id === ejercicioSeleccionado)
    .map((r) => ({ fecha: formatFecha(r.fecha), rm: parseFloat(r.rm_estimado) }));

  const datosDuracion = historialSesiones
    .filter((s) => s.duracion_segundos)
    .map((s) => ({ fecha: formatFecha(s.fecha), minutos: Math.round(s.duracion_segundos / 60) }));

  const datosBorg = historialSesiones
    .filter((s) => s.esfuerzo_percibido_borg !== null)
    .map((s) => ({ fecha: formatFecha(s.fecha), borg: s.esfuerzo_percibido_borg }));

  const tooltipStyle = { background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, fontFamily: "Inter", fontSize: 12, color: COLORS.text };

  if (cargando) {
    return <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando progreso...</span>;
  }

  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 640 }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.accent }}>RM a lo largo del tiempo</span>
          {ejerciciosConRM.length > 0 && (
            <select
              value={ejercicioSeleccionado}
              onChange={(ev) => setEjercicioSeleccionado(ev.target.value)}
              style={{ background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 8px", fontFamily: "Inter", fontSize: 12 }}
            >
              {ejerciciosConRM.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          )}
        </div>
        {ejerciciosConRM.length === 0 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay cálculos de RM guardados.</span>
        ) : datosRM.length < 2 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Necesitás al menos 2 cálculos de este ejercicio en distintas fechas para ver la evolución.</span>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datosRM}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke={COLORS.dim} fontSize={11} />
              <YAxis stroke={COLORS.dim} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rm" name="RM (kg)" stroke={COLORS.accent} strokeWidth={2} dot={{ fill: COLORS.accent, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.accent, marginBottom: 12 }}>Duración de las sesiones</div>
        {datosDuracion.length < 2 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay suficientes sesiones con cronómetro guardado.</span>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosDuracion}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke={COLORS.dim} fontSize={11} />
              <YAxis stroke={COLORS.dim} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="minutos" name="Minutos" stroke={COLORS.accentDim} strokeWidth={2} dot={{ fill: COLORS.accentDim, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.accent, marginBottom: 12 }}>Esfuerzo percibido (Borg)</div>
        {datosBorg.length < 2 ? (
          <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>Todavía no hay suficientes sesiones con esfuerzo percibido guardado.</span>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosBorg}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke={COLORS.dim} fontSize={11} />
              <YAxis domain={[6, 20]} stroke={COLORS.dim} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="borg" name="Borg" stroke={COLORS.danger} strokeWidth={2} dot={{ fill: COLORS.danger, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function RMCalculator({ alumno }) {
  const allExercises = [];
  alumno.days.forEach((d) =>
    d.exercises.forEach((e) => {
      if (e.catalogId && !allExercises.find((x) => x.catalogId === e.catalogId)) {
        allExercises.push({ catalogId: e.catalogId, name: e.name });
      }
    })
  );

  const [selected, setSelected] = useState(allExercises[0]?.catalogId || "");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const w = parseFloat(weight);
  const r = parseInt(reps, 10);
  const valid = w > 0 && r > 0 && r <= 20;
  const rm = valid ? w * (1 + r / 30) : null;
  const percentages = [100, 90, 85, 80, 75, 70, 65, 60];
  const selectedName = allExercises.find((x) => x.catalogId === selected)?.name || "";

  const guardarRM = async () => {
    if (!rm || !selected) return;
    setGuardando(true);
    try {
      await api.guardarRM({
        alumnoId: alumno.id,
        ejercicioId: selected,
        pesoUsado: weight,
        repsUsadas: r,
        rmEstimado: rm.toFixed(1),
      });
      setGuardado(true);
    } catch (err) {
      alert("No se pudo guardar la RM: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={20} color={COLORS.accent} />
        <span style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 1, color: COLORS.text }}>Calculadora de RM</span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginBottom: 20 }}>
        Elegí un ejercicio y cargá un peso y reps que hayas hecho recientemente para estimar tu repetición máxima.
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Ejercicio</label>
            <select
              value={selected}
              onChange={(ev) => { setSelected(ev.target.value); setGuardado(false); }}
              style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: "Inter", fontSize: 14 }}
            >
              {allExercises.map((ex) => (
                <option key={ex.catalogId} value={ex.catalogId}>{ex.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Peso levantado (kg)</label>
              <input
                value={weight}
                onChange={(ev) => setWeight(ev.target.value)}
                placeholder="Ej: 60"
                style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: "JetBrains Mono", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
            <div className="flex-1">
              <label style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Repeticiones</label>
              <input
                value={reps}
                onChange={(ev) => setReps(ev.target.value)}
                placeholder="Ej: 6"
                style={{ width: "100%", background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: "JetBrains Mono", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

        {rm ? (
          <div className="mt-5">
            <div className="flex items-baseline gap-2" style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
              <span style={{ fontFamily: "Bebas Neue", fontSize: 44, color: COLORS.accent, letterSpacing: 1 }}>{rm.toFixed(1)} kg</span>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>RM estimada en {selectedName}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {percentages.map((p) => (
                <div key={p} className="rounded-md px-2 py-2 text-center" style={{ background: COLORS.surface2 }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.text }}>{((rm * p) / 100).toFixed(1)}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 10, color: COLORS.dim, marginTop: 2 }}>{p}%</div>
                </div>
              ))}
            </div>
            <button
              onClick={guardarRM}
              disabled={guardando || guardado}
              className="mt-4 px-3 py-2 rounded-md"
              style={{
                background: guardado ? COLORS.surface2 : COLORS.accent,
                color: guardado ? COLORS.dim : "#101215",
                fontFamily: "Inter", fontSize: 13, fontWeight: 600, opacity: guardando ? 0.6 : 1,
              }}
            >
              {guardado ? "Guardado en tu historial ✓" : guardando ? "Guardando..." : "Guardar en mi historial"}
            </button>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 10 }}>
              Estimación con fórmula de Epley. Es orientativa, no reemplaza un test real de 1RM.
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
            Cargá un peso y reps (hasta 20) para ver tu RM estimada.
          </div>
        )}
      </div>
    </div>
  );
}

function BorgScale({ value, onChange }) {
  const v = value ?? 12;
  const color = borgColor(v);
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
      <div className="flex items-center gap-2 mb-1">
        <Flame size={16} color={COLORS.accent} />
        <span style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 1, color: COLORS.text }}>Esfuerzo percibido</span>
        <span style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim }}>escala de Borg (6-20)</span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim, marginBottom: 14 }}>
        ¿Qué tan dura sentiste la sesión de hoy en general?
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={6}
          max={20}
          value={v}
          onChange={(ev) => onChange(Number(ev.target.value))}
          style={{ flex: 1, accentColor: color }}
        />
        <span
          className="flex items-center justify-center"
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${color}22`, border: `1px solid ${color}`,
            fontFamily: "JetBrains Mono", fontSize: 16, fontWeight: 700, color,
          }}
        >
          {v}
        </span>
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 13, color, marginTop: 8, fontWeight: 600 }}>
        {borgLabel(v)}
      </div>
      {value === null && (
        <div style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim, marginTop: 6 }}>
          Movete la barra para registrar tu esfuerzo de hoy.
        </div>
      )}
    </div>
  );
}

function SessionStopwatch({ elapsed, running, onStart, onPause, onReset }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: COLORS.text, minWidth: 56 }}>{formatTime(elapsed)}</span>
      {running ? (
        <button onClick={onPause} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md" style={{ background: COLORS.surface2, color: COLORS.text }}>
          <Pause size={13} />
        </button>
      ) : (
        <button onClick={onStart} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md" style={{ background: COLORS.accent, color: "#101215" }}>
          <Play size={13} />
        </button>
      )}
      <button onClick={onReset} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md" style={{ background: COLORS.surface2, color: COLORS.dim }}>
        <RotateCcw size={13} />
      </button>
      <span style={{ fontFamily: "Inter", fontSize: 11, color: COLORS.dim }}>duración de la sesión</span>
    </div>
  );
}

function AlumnoView({ alumno, setAlumnos }) {
  const [section, setSection] = useState("sesion");
  const [dayIdx, setDayIdx] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  const [sessionTimer, setSessionTimer] = useState({ running: false, elapsed: 0 });

  const sinDias = !alumno.days || alumno.days.length === 0;
  const day = sinDias ? { exercises: [], dayId: null, rpeBorg: null } : alumno.days[dayIdx];
  const pct = Math.round((day.exercises.filter((e) => e.done).length / (day.exercises.length || 1)) * 100) || 0;

  useEffect(() => {
    if (!restTimer || restTimer.secondsLeft <= 0) return;
    const t = setTimeout(() => setRestTimer((prev) => (prev ? { ...prev, secondsLeft: prev.secondsLeft - 1 } : prev)), 1000);
    return () => clearTimeout(t);
  }, [restTimer]);

  useEffect(() => {
    if (!sessionTimer.running) return;
    const t = setTimeout(() => setSessionTimer((prev) => ({ ...prev, elapsed: prev.elapsed + 1 })), 1000);
    return () => clearTimeout(t);
  }, [sessionTimer]);

  const startRest = (exId, seconds) => setRestTimer({ exId, secondsLeft: seconds, total: seconds });

  const pausarCronometro = () => {
    setSessionTimer((p) => ({ ...p, running: false }));
    api.guardarDuracionSesion({ dayId: day.dayId, alumnoId: alumno.id, segundos: sessionTimer.elapsed }).catch((err) =>
      alert("No se pudo guardar la duración: " + err.message)
    );
  };

  const setBorg = (value) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) => (idx === dayIdx ? { ...d, rpeBorg: value } : d));
        return { ...a, days };
      })
    );
    api.guardarBorg({ dayId: day.dayId, alumnoId: alumno.id, valor: value }).catch((err) =>
      alert("No se pudo guardar el esfuerzo percibido: " + err.message)
    );
  };

  const toggleDone = (exId) => {
    const actual = day.exercises.find((e) => e.id === exId)?.done;
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, done: !e.done } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
    api
      .marcarEjercicio({ dayId: day.dayId, alumnoId: alumno.id, diaEjercicioId: exId, hecho: !actual })
      .catch((err) => alert("No se pudo guardar: " + err.message));
  };

  const updateLog = (exId, field, value) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, [field]: value } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
  };

  const guardarLogEnBlur = (exId) => {
    const ex = day.exercises.find((e) => e.id === exId);
    if (!ex) return;
    api
      .guardarLog({ dayId: day.dayId, alumnoId: alumno.id, diaEjercicioId: exId, pesoLogrado: ex.logWeight, repsLogradas: ex.logReps })
      .catch((err) => alert("No se pudo guardar el registro: " + err.message));
  };

  const toggleComments = (exId) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumno.id) return a;
        const days = a.days.map((d, idx) =>
          idx === dayIdx
            ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, showComments: !e.showComments } : e)) }
            : d
        );
        return { ...a, days };
      })
    );
  };

  const addComment = async (exId, comment) => {
    try {
      const guardado = await api.agregarComentario({ diaEjercicioId: exId, autorId: alumno.id, texto: comment.text });
      const comentarioReal = { id: guardado.id, author: "alumno", authorName: alumno.name.split(" ")[0], text: comment.text };
      setAlumnos((prev) =>
        prev.map((a) => {
          if (a.id !== alumno.id) return a;
          const days = a.days.map((d, idx) =>
            idx === dayIdx
              ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, comments: [...e.comments, comentarioReal] } : e)) }
              : d
          );
          return { ...a, days };
        })
      );
    } catch (err) {
      alert("No se pudo guardar el comentario: " + err.message);
    }
  };

  if (sinDias) {
    return (
      <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, textAlign: "center", padding: "40px 0" }}>
        Todavía no tenés ningún día de entrenamiento cargado. Avisale a tu profesor.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="flex gap-1 p-1 rounded-full mb-6" style={{ background: COLORS.surface, width: "fit-content" }}>
        <button
          onClick={() => setSection("sesion")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "sesion" ? COLORS.accent : "transparent",
            color: section === "sesion" ? "#101215" : COLORS.dim,
          }}
        >
          <Flame size={14} /> Sesión
        </button>
        <button
          onClick={() => setSection("rm")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "rm" ? COLORS.accent : "transparent",
            color: section === "rm" ? "#101215" : COLORS.dim,
          }}
        >
          <Calculator size={14} /> Calcular RM
        </button>
        <button
          onClick={() => setSection("progreso")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "Inter", fontSize: 13, fontWeight: 600,
            background: section === "progreso" ? COLORS.accent : "transparent",
            color: section === "progreso" ? "#101215" : COLORS.dim,
          }}
        >
          <TrendingUp size={14} /> Progreso
        </button>
      </div>

      {section === "rm" ? (
        <RMCalculator alumno={alumno} />
      ) : section === "progreso" ? (
        <ProgresoView alumnoId={alumno.id} />
      ) : (
      <>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-2">
          {alumno.days.map((d, idx) => (
            <button
              key={d.day}
              onClick={() => { setDayIdx(idx); setRestTimer(null); }}
              className="px-3 py-1.5 rounded-full"
              style={{
                fontFamily: "Inter",
                fontSize: 13,
                fontWeight: 600,
                background: idx === dayIdx ? COLORS.accent : COLORS.surface2,
                color: idx === dayIdx ? "#101215" : COLORS.dim,
              }}
            >
              {d.day}
            </button>
          ))}
        </div>
        <SessionStopwatch
          elapsed={sessionTimer.elapsed}
          running={sessionTimer.running}
          onStart={() => setSessionTimer((p) => ({ ...p, running: true }))}
          onPause={pausarCronometro}
          onReset={() => setSessionTimer({ running: false, elapsed: 0 })}
        />
      </div>

      <div style={{ fontFamily: "Bebas Neue", fontSize: 34, letterSpacing: 1, color: COLORS.text, lineHeight: 1 }}>{day.focus}</div>
      <div style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim, marginTop: 4, marginBottom: 16 }}>
        {day.exercises.length} ejercicios · sesión de hoy
      </div>

      <div style={{ marginBottom: 20 }}>
        <BarbellProgress pct={pct} />
      </div>

      <div className="flex flex-col gap-3">
        {day.exercises.map((e) => (
          <div
            key={e.id}
            style={{
              background: COLORS.surface,
              border: `1px solid ${e.done ? COLORS.accentDim : COLORS.border}`,
              borderRadius: 10,
              padding: 14,
              opacity: e.done ? 0.75 : 1,
              transition: "all 200ms ease",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: COLORS.text }}>{e.name}</div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: COLORS.dim, marginTop: 2 }}>
                  Objetivo: {e.sets}×{e.reps} · {e.targetWeight}
                </div>
              </div>
              <button
                onClick={() => toggleDone(e.id)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: e.done ? COLORS.accent : "transparent",
                  border: `1px solid ${e.done ? COLORS.accent : COLORS.border}`,
                  color: e.done ? "#101215" : COLORS.dim,
                }}
              >
                <Check size={16} />
              </button>
            </div>

            <div className="mt-2">
              <MediaBox url={e.mediaUrl} />
            </div>

            <div className="flex gap-2 mt-3 flex-wrap items-center">
              <input
                placeholder="kg"
                value={e.logWeight}
                onChange={(ev) => updateLog(e.id, "logWeight", ev.target.value)}
                onBlur={() => guardarLogEnBlur(e.id)}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "JetBrains Mono", fontSize: 13 }}
              />
              <input
                placeholder="reps"
                value={e.logReps}
                onChange={(ev) => updateLog(e.id, "logReps", ev.target.value)}
                onBlur={() => guardarLogEnBlur(e.id)}
                style={{ width: 70, background: COLORS.surface2, color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 8px", fontFamily: "JetBrains Mono", fontSize: 13 }}
              />
              <span style={{ fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}>registrado</span>

              <div className="flex items-center gap-1 ml-auto">
                {restTimer && restTimer.exId === e.id ? (
                  <span
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                    style={{ background: "rgba(91,155,199,0.12)", border: `1px solid ${COLORS.accent}`, fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.accent }}
                  >
                    <Clock size={13} /> {formatTime(restTimer.secondsLeft)}
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => startRest(e.id, e.restSets)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                      style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                    >
                      <Clock size={12} /> Descanso {e.restSets}s
                    </button>
                    <button
                      onClick={() => startRest(e.id, e.restAfter)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md"
                      style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, fontFamily: "Inter", fontSize: 12, color: COLORS.dim }}
                    >
                      <Clock size={12} /> Post {e.restAfter}s
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => toggleComments(e.id)}
              className="flex items-center gap-1.5 mt-3"
              style={{ color: e.comments.length ? COLORS.accent : COLORS.dim, fontFamily: "Inter", fontSize: 12 }}
            >
              <MessageSquare size={13} />
              {e.comments.length > 0 ? `${e.comments.length} comentario${e.comments.length > 1 ? "s" : ""}` : "Dejar feedback"}
            </button>

            {e.showComments && (
              <CommentsPanel exercise={e} onAddComment={addComment} currentAuthor="alumno" currentAuthorName={alumno.name.split(" ")[0]} />
            )}
          </div>
        ))}
      </div>

      {pct === 100 && (
        <div className="flex items-center gap-2 mt-5 px-3 py-2 rounded-md" style={{ background: "rgba(226,74,59,0.12)", border: `1px solid ${COLORS.danger}` }}>
          <Flame size={16} color={COLORS.danger} />
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.text }}>Sesión completa. Buen laburo.</span>
        </div>
      )}

      <div className="mt-5">
        <BorgScale value={day.rpeBorg} onChange={setBorg} />
      </div>
      </>
      )}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = todavía no sabemos
  const [usuario, setUsuario] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const usuarioIdCargado = useRef(null);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) { setUsuario(null); usuarioIdCargado.current = null; return; }
    if (usuarioIdCargado.current === session.user.id) return; // misma persona, no recargar todo
    setCargandoPerfil(true);
    obtenerUsuarioActual()
      .then((u) => { setUsuario(u); usuarioIdCargado.current = session.user.id; })
      .finally(() => setCargandoPerfil(false));
  }, [session]);

  useEffect(() => {
    if (!usuario) return;
    setCargandoDatos(true);
    setErrorDatos("");
    const cargar =
      usuario.rol === "profesor"
        ? api.fetchAlumnosConRutinas()
        : api.fetchDiasDeAlumno(usuario.id).then(({ rutinaId, days }) => [{ id: usuario.id, name: usuario.nombre, rutinaId, days }]);
    cargar
      .then((data) => setAlumnos(data))
      .catch((err) => setErrorDatos(err.message))
      .finally(() => setCargandoDatos(false));
  }, [usuario]);

  if (session === undefined || cargandoPerfil) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando...</span>
      </div>
    );
  }

  if (!session || !usuario) {
    return <Login />;
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%", width: "100%", padding: "28px 24px", boxSizing: "border-box" }}>
      <style>{FONT_IMPORT}</style>
      <div className="flex items-center justify-between mb-8" style={{ maxWidth: 900, margin: "0 auto 32px auto" }}>
        <div className="flex items-center gap-2.5">
          <img src={LOGO_ICON} alt="Fitnourish" style={{ height: 30, width: "auto" }} />
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: COLORS.text }}>
              Fit<span style={{ fontWeight: 400 }}>nourish</span>
            </span>
            <span style={{ fontFamily: "Inter", fontSize: 10, letterSpacing: 1.5, color: COLORS.dim, marginTop: 2 }}>
              ENTRENA CON <span style={{ color: COLORS.accent }}>CIENCIA</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>
            Hola, <span style={{ color: COLORS.text, fontWeight: 600 }}>{usuario.nombre}</span>
          </span>
          <button
            onClick={() => cerrarSesion()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: COLORS.surface, color: COLORS.dim, fontFamily: "Inter", fontSize: 13 }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {cargandoDatos ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Cargando tus datos...</span>
        ) : errorDatos ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.danger }}>Error al cargar: {errorDatos}</span>
        ) : usuario.rol === "alumno" && alumnos.length === 0 ? (
          <span style={{ fontFamily: "Inter", fontSize: 13, color: COLORS.dim }}>Todavía no tenés una rutina asignada.</span>
        ) : usuario.rol === "profesor" ? (
          <ProfesorView alumnos={alumnos} setAlumnos={setAlumnos} usuario={usuario} />
        ) : (
          <AlumnoView alumno={alumnos[0]} setAlumnos={setAlumnos} />
        )}
      </div>
    </div>
  );
}
