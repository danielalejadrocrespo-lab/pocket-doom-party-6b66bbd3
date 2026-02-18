/**
 * DoomPlayer — Componente autónomo que ejecuta DOOM (shareware) en el navegador
 * usando WebAssembly. Se puede importar en cualquier página React.
 *
 * Uso:
 *   import DoomPlayer from "@/components/DoomPlayer";
 *   <DoomPlayer />
 *
 * Requisitos CSS (index.css):
 *   - .doom-border  → borde rojo pixelado
 *   - .doom-glow    → texto con resplandor rojo
 *   - .fire-gradient → gradiente de fuego en texto
 *   - .scanlines    → overlay de líneas de escáner CRT
 *   - Variables CSS: --doom-red, --doom-panel
 *
 * Controles dentro del juego:
 *   Movimiento : ↑↓←→  |  Sprint: SHIFT  |  Strafe: ALT + ←→
 *   Disparo    : CTRL  |  Usar/Puertas: SPACE  |  Armas: 1-7
 *   Menú/Pausa : ESC   |  Mapa: TAB  |  Guardar: F2  |  Cargar: F3
 *   Guardado rápido: F6 / F9
 *
 * WASM: https://github.com/diekmann/wasm-fizzbuzz (doom.wasm)
 */
import { useEffect, useRef, useState } from "react";

/** URL del binario DOOM WebAssembly (shareware, versión pública) */
const DOOM_WASM_URL = "https://diekmann.github.io/wasm-fizzbuzz/doom/doom.wasm";

/** Resolución de pantalla de DOOM × 2 para mayor nitidez */
const DOOM_SCREEN_WIDTH = 320 * 2;
const DOOM_SCREEN_HEIGHT = 200 * 2;

/**
 * Convierte keycodes del navegador a keycodes nativos de DOOM.
 * DOOM usa sus propios códigos internos distintos a los del DOM.
 */
function doomKeyCode(keyCode: number): number {
  switch (keyCode) {
    case 8:  return 127;           // Backspace → KEY_BACKSPACE
    case 17: return 0x80 + 0x1d; // Ctrl      → KEY_RCTRL  (DISPARO)
    case 18: return 0x80 + 0x38; // Alt       → KEY_RALT   (STRAFE)
    case 37: return 0xac;        // ←  KEY_LEFTARROW
    case 38: return 0xad;        // ↑  KEY_UPARROW
    case 39: return 0xae;        // →  KEY_RIGHTARROW
    case 40: return 0xaf;        // ↓  KEY_DOWNARROW
    default:
      if (keyCode >= 65 && keyCode <= 90)  return keyCode + 32; // A-Z → a-z
      if (keyCode >= 112 && keyCode <= 123) return keyCode + 75; // F1-F12
      return keyCode;
  }
}

export default function DoomPlayer() {
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const memoryRef = useRef<WebAssembly.Memory | null>(null);
  const instanceRef = useRef<WebAssembly.Instance | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const startDoom = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const memory = new WebAssembly.Memory({ initial: 108 });
      memoryRef.current = memory;

      function drawCanvas(ptr: number) {
        const doomScreen = new Uint8ClampedArray(
          memory.buffer,
          ptr,
          DOOM_SCREEN_WIDTH * DOOM_SCREEN_HEIGHT * 4
        );
        const renderScreen = new ImageData(doomScreen, DOOM_SCREEN_WIDTH, DOOM_SCREEN_HEIGHT);
        const ctx = canvas.getContext("2d");
        ctx?.putImageData(renderScreen, 0, 0);
      }

      const importObject = {
        js: {
          js_console_log: () => {},
          js_stdout: () => {},
          js_stderr: () => {},
          js_milliseconds_since_start: () => performance.now(),
          js_draw_screen: drawCanvas,
        },
        env: { memory },
      };

      const result = await WebAssembly.instantiateStreaming(
        fetch(DOOM_WASM_URL),
        importObject
      );

      const instance = result.instance;
      instanceRef.current = instance;

      // Initialize DOOM
      (instance.exports.main as () => void)();

      // Keyboard input
      const keyDown = (kc: number) =>
        (instance.exports.add_browser_event as (t: number, kc: number) => void)(0, kc);
      const keyUp = (kc: number) =>
        (instance.exports.add_browser_event as (t: number, kc: number) => void)(1, kc);

      canvas.addEventListener("keydown", (e) => {
        keyDown(doomKeyCode(e.keyCode));
        e.preventDefault();
      });
      canvas.addEventListener("keyup", (e) => {
        keyUp(doomKeyCode(e.keyCode));
        e.preventDefault();
      });

      canvas.focus();
      setStatus("running");

      // Game loop
      const step = () => {
        (instance.exports.doom_loop_step as () => void)();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    } catch (err) {
      console.error("DOOM WASM failed:", err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  const handleFullscreen = () => {
    canvasRef.current?.requestFullscreen?.();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Game viewport */}
      <div
        className="relative w-full max-w-4xl doom-border overflow-hidden"
        style={{ aspectRatio: "16/10", background: "#000" }}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

        {/* DOOM Canvas */}
        <canvas
          ref={canvasRef}
          width={DOOM_SCREEN_WIDTH}
          height={DOOM_SCREEN_HEIGHT}
          tabIndex={0}
          className="w-full h-full outline-none"
          style={{
            display: status === "running" ? "block" : "none",
            imageRendering: "pixelated",
            cursor: "crosshair",
          }}
        />

        {/* Idle overlay */}
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <p className="text-muted-foreground text-xs mb-8 font-mono tracking-widest uppercase">
              [ Click to summon hell ]
            </p>
            <button onClick={startDoom} className="group relative px-10 py-5">
              <span
                className="relative z-10 fire-gradient"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1rem" }}
              >
                ▶ PLAY DOOM
              </span>
              <div className="absolute inset-0 doom-border" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "hsl(var(--doom-red) / 0.1)" }}
              />
            </button>
          </div>
        )}

        {/* Loading overlay */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-6">
            <p
              className="doom-glow"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.65rem" }}
            >
              LOADING...
            </p>
            <p className="text-muted-foreground text-xs font-mono">
              Compiling DOOM WebAssembly, please wait
            </p>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3"
                  style={{
                    background: "hsl(var(--doom-red))",
                    animation: `pulse 1s ease-in-out ${i * 0.15}s infinite`,
                    boxShadow: "0 0 8px hsl(var(--doom-red))",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error overlay */}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-4 p-8">
            <p
              className="doom-glow text-center"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.6rem" }}
            >
              ☠ GAME OVER ☠
            </p>
            <p className="text-muted-foreground text-xs font-mono text-center max-w-xs">
              {errorMsg}
            </p>
            <button
              onClick={startDoom}
              className="mt-4 px-6 py-3 doom-border text-sm font-mono text-primary hover:bg-primary/10 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Controls bar */}
      {status === "running" && (
        <div className="flex gap-4 items-center">
          <button
            onClick={handleFullscreen}
            className="px-6 py-2 doom-border text-sm font-mono text-primary hover:bg-primary/10 transition-colors tracking-widest"
          >
            ⛶ FULLSCREEN
          </button>
          <p className="text-xs font-mono text-muted-foreground">
            Click canvas to capture input
          </p>
        </div>
      )}
    </div>
  );
}
