import React, { useState } from "react";
import { iniciarSesion, registrarProfesor } from "./lib/supabaseClient";

const COLORS = {
  bg: "#0E1013",
  surface: "#1A1D21",
  surface2: "#23272C",
  border: "#31363C",
  text: "#EDEDE7",
  dim: "#8B9096",
  accent: "#5B9BC7",
  danger: "#E24A3B",
};

export default function Login() {
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avisoRegistro, setAvisoRegistro] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (modo === "login") {
        const { error } = await iniciarSesion({ email, password });
        if (error) throw error;
        // El listener de sesión en App.jsx se encarga de redirigir solo.
      } else {
        const { error } = await registrarProfesor({ email, password, nombre });
        if (error) throw error;
        setAvisoRegistro(true);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: COLORS.surface2,
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: "10px 12px",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 24, fontWeight: 700, color: COLORS.text }}>
            Fit<span style={{ fontWeight: 400 }}>nourish</span>
          </span>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: 1.5, color: COLORS.dim, marginTop: 4 }}>
            ENTRENA CON <span style={{ color: COLORS.accent }}>CIENCIA</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, background: COLORS.surface, borderRadius: 9999, padding: 4, marginBottom: 20 }}>
          <button
            onClick={() => { setModo("login"); setError(""); setAvisoRegistro(false); }}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 9999,
              fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
              background: modo === "login" ? COLORS.accent : "transparent",
              color: modo === "login" ? "#101215" : COLORS.dim,
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setModo("registro"); setError(""); setAvisoRegistro(false); }}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 9999,
              fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
              background: modo === "registro" ? COLORS.accent : "transparent",
              color: modo === "registro" ? "#101215" : COLORS.dim,
            }}
          >
            Crear cuenta (profesor)
          </button>
        </div>

        {avisoRegistro ? (
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.accent}`, borderRadius: 10, padding: 16, fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.text }}>
            Cuenta creada. Revisá tu email ({email}) para confirmar la cuenta antes de iniciar sesión.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {modo === "registro" && (
                <div>
                  <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Tu nombre</label>
                  <input value={nombre} onChange={(e) => setNombre(e.target.value)} required style={inputStyle} placeholder="Ej: Juan Pérez" />
                </div>
              )}
              <div>
                <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="vos@ejemplo.com" />
              </div>
              <div>
                <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.dim, display: "block", marginBottom: 6 }}>Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="Mínimo 6 caracteres" />
              </div>

              {error && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.danger }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: COLORS.accent, color: "#101215", border: "none",
                  borderRadius: 6, padding: "10px 0", fontFamily: "Inter, sans-serif",
                  fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Un momento..." : modo === "login" ? "Entrar" : "Crear mi cuenta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}