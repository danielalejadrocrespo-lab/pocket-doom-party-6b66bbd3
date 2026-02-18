import { useState } from "react";

// Official js-dos v7 iframe embed URL for DOOM
const DOOM_IFRAME_SRC =
  "https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos&anonymous=1";

export default function DoomPlayer() {
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
            <p className="text-muted-foreground text-xs mb-8 font-mono tracking-widest uppercase">
              [ Click to summon hell ]
            </p>
            <button onClick={() => setStarted(true)} className="group relative px-10 py-5">
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

        {/* Loading spinner while iframe loads */}
        {started && !loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-6">
            <p
              className="doom-glow"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.65rem" }}
            >
              LOADING...
            </p>
            <p className="text-muted-foreground text-xs font-mono">
              Summoning demons from hell, please wait
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

        {/* Game iframe */}
        {started && (
          <iframe
            src={DOOM_IFRAME_SRC}
            title="DOOM"
            onLoad={() => setLoaded(true)}
            className="w-full h-full border-0"
            allow="fullscreen; autoplay"
            style={{
              display: "block",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        )}
      </div>

      {started && loaded && (
        <p className="text-xs font-mono text-muted-foreground tracking-widest text-center">
          Click inside the game to capture keyboard input · Use fullscreen for best experience
        </p>
      )}

      {/* Note about preview limitations */}
      {!started && (
        <p className="text-xs font-mono text-center max-w-lg" style={{ color: "hsl(var(--doom-red) / 0.7)" }}>
          ⚠ The game requires the published URL to run — publish your app to play DOOM
        </p>
      )}
    </div>
  );
}
