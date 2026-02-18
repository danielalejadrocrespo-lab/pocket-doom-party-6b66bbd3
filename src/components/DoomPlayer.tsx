import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emulators: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Dos: any;
  }
}

const DOOM_BUNDLE_URL = "https://cdn.dos.zone/custom/dos/doom.jsdos";

export default function DoomPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ciRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (ciRef.current) {
        ciRef.current.stop?.();
      }
    };
  }, []);

  const startDoom = async () => {
    if (!containerRef.current) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      // Dynamically load js-dos from CDN (v7)
      if (!window.Dos) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://v8.js-dos.com/latest/dos.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load js-dos"));
          document.head.appendChild(script);
        });
      }

      // Create canvas inside container
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(canvas);

      const ci = await window.Dos(canvas, {
        url: DOOM_BUNDLE_URL,
        onEvent: (event: string) => {
          if (event === "emu-ready") {
            setStatus("running");
          }
        },
      });

      ciRef.current = ci;
      setStatus("running");
    } catch (err) {
      console.error("DOOM failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  const handleFullscreen = () => {
    containerRef.current?.requestFullscreen?.();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Game viewport */}
      <div className="relative w-full max-w-4xl doom-border" style={{ aspectRatio: "4/3" }}>
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

        {/* Game container */}
        <div
          ref={containerRef}
          className="w-full h-full bg-black flex items-center justify-center"
        />

        {/* Idle overlay */}
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <div className="text-center px-6">
              <p className="text-muted-foreground text-sm mb-8 font-mono tracking-widest uppercase">
                [Click to summon hell]
              </p>
              <button
                onClick={startDoom}
                className="doom-play-btn group relative px-10 py-5 text-lg font-bold tracking-widest uppercase transition-all duration-200"
              >
                <span className="relative z-10 fire-gradient" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1rem" }}>
                  ▶ PLAY DOOM
                </span>
                <div className="absolute inset-0 doom-border" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "hsl(0 90% 50% / 0.1)" }} />
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-6">
            <div className="text-center">
              <p className="doom-glow text-2xl mb-2" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.75rem" }}>
                LOADING...
              </p>
              <p className="text-muted-foreground text-xs font-mono mt-4">
                Summoning demons from hell, please wait
              </p>
            </div>
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
            <p className="doom-glow text-center" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.6rem" }}>
              ☠ GAME OVER ☠
            </p>
            <p className="text-muted-foreground text-xs font-mono text-center">{errorMsg}</p>
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
        </div>
      )}
    </div>
  );
}
