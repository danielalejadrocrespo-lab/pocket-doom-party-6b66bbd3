import doomBg from "@/assets/doom-bg.jpg";
import DoomPlayer from "@/components/DoomPlayer";

const CONTROLS = [
  { key: "↑ ↓ ← →", action: "Move / Turn" },
  { key: "W", action: "Use / Open" },
  { key: "S", action: "Fire" },
  { key: "SPACE", action: "Speed" },
  { key: "ALT", action: "Strafe mode" },
  { key: "A / D", action: "Strafe" },
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
            CONTROLS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CONTROLS.map(({ key, action }) => (
              <div
                key={key}
                className="flex items-center gap-3 p-3"
                style={{
                  background: "hsl(var(--doom-panel))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <kbd
                  className="px-2 py-1 text-xs font-mono shrink-0"
                  style={{
                    background: "hsl(var(--doom-red) / 0.15)",
                    border: "1px solid hsl(var(--doom-red) / 0.5)",
                    color: "hsl(var(--doom-red))",
                    minWidth: "4rem",
                    textAlign: "center",
                  }}
                >
                  {key}
                </kbd>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {action}
                </span>
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
