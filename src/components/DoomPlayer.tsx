import { useState } from "react";

const DOOM_URL =
  "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos%3Fanonymous%3D1&userid=anonymous";

export default function DoomPlayer() {
  const [started, setStarted] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Game viewport */}
      <div
        className="relative w-full max-w-4xl doom-border overflow-hidden"
        style={{ aspectRatio: "4/3", background: "#000" }}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

        {/* Idle overlay */}
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <div className="text-center px-6">
              <p className="text-muted-foreground text-xs mb-8 font-mono tracking-widest uppercase">
                [ Click to summon hell ]
              </p>
              <button
                onClick={() => setStarted(true)}
                className="group relative px-10 py-5"
              >
                <span
                  className="relative z-10 fire-gradient"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "1rem",
                  }}
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
          </div>
        )}

        {/* Game iframe */}
        {started && (
          <iframe
            src={DOOM_URL}
            title="DOOM"
            className="w-full h-full border-0"
            allow="fullscreen; autoplay"
            style={{ display: "block" }}
          />
        )}
      </div>

      {/* Hint */}
      {started && (
        <p className="text-xs font-mono text-muted-foreground tracking-widest">
          Use the fullscreen button inside the player for the best experience
        </p>
      )}
    </div>
  );
}
