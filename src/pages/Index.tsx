import doomBg from "@/assets/doom-bg.jpg";
import DoomPlayer from "@/components/DoomPlayer";

const CONTROL_GROUPS = [
  {
    label: "MOVIMIENTO",
    controls: [
      { key: "↑ / ↓", action: "Avanzar / Retroceder" },
      { key: "← / →", action: "Girar izquierda / derecha" },
      { key: "ALT + ← →", action: "Desplazarse lateral" },
      { key: "SHIFT", action: "Correr (sprint)" },
    ],
  },
  {
    label: "COMBATE",
    controls: [
      { key: "CTRL", action: "Disparar" },
      { key: "SPACE", action: "Abrir puertas / Usar" },
      { key: "1 – 7", action: "Seleccionar arma" },
    ],
  },
  {
    label: "SISTEMA",
    controls: [
      { key: "ESC", action: "Menú / Pausa" },
      { key: "TAB", action: "Mapa automático" },
      { key: "F1", action: "Ayuda" },
      { key: "F2", action: "Guardar partida" },
      { key: "F3", action: "Cargar partida" },
      { key: "F6", action: "Guardar rápido" },
      { key: "F9", action: "Cargar rápido" },
    ],
  },
];

const Index = () => {
  return (
    <div
      className="min-h-screen text-foreground"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Hero header */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${doomBg})`, opacity: 0.35 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, hsl(var(--background)) 100%)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
          <p
            className="text-xs font-mono tracking-[0.4em] mb-4 uppercase"
            style={{ color: "hsl(var(--doom-red))" }}
          >
            id Software · 1993
          </p>
          <h1
            className="doom-glow fire-gradient mb-4 leading-tight"
            style={{ fontSize: "clamp(2rem, 8vw, 5rem)" }}
          >
            DOOM
          </h1>
          <p className="text-muted-foreground font-mono text-sm tracking-widest">
            KNEE-DEEP IN THE DEAD
          </p>
        </div>
      </header>

      {/* Game section */}
      <main className="max-w-5xl mx-auto px-4 pb-16">
        <DoomPlayer />

        {/* Controls */}
        <section className="mt-12">
          <h2
            className="text-center mb-8 doom-glow"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.7rem", color: "hsl(var(--doom-red))", letterSpacing: "0.3em" }}
          >
            CONTROLES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CONTROL_GROUPS.map(({ label, controls }) => (
              <div
                key={label}
                style={{
                  background: "hsl(var(--doom-panel))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div
                  className="px-4 py-2 text-center"
                  style={{
                    background: "hsl(var(--doom-red) / 0.15)",
                    borderBottom: "1px solid hsl(var(--doom-red) / 0.4)",
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "0.5rem",
                    color: "hsl(var(--doom-red))",
                    letterSpacing: "0.2em",
                  }}
                >
                  {label}
                </div>
                <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
                  {controls.map(({ key, action }) => (
                    <div key={key} className="flex items-center gap-3 px-4 py-2">
                      <kbd
                        className="px-2 py-1 text-xs font-mono shrink-0"
                        style={{
                          background: "hsl(var(--doom-red) / 0.1)",
                          border: "1px solid hsl(var(--doom-red) / 0.5)",
                          color: "hsl(var(--doom-red))",
                          minWidth: "5rem",
                          textAlign: "center",
                          fontSize: "0.6rem",
                        }}
                      >
                        {key}
                      </kbd>
                      <span className="text-xs font-mono text-muted-foreground tracking-wide">
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info */}
        <section
          className="mt-10 p-6 text-center"
          style={{
            background: "hsl(var(--doom-panel))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <p className="text-muted-foreground font-mono text-xs leading-relaxed">
            Powered by{" "}
            <a
              href="https://js-dos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              style={{ color: "hsl(var(--doom-red))" }}
            >
              js-dos
            </a>{" "}
            · DOOM © id Software · Shareware version
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;
