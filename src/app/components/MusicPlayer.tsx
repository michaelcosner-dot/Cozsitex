import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, ChevronDown } from "lucide-react";

const STATIONS = [
  {
    id: "elevator",
    name: "Elevator",
    detail: "Groove Salad · ambient",
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
    emoji: "🛗",
    hue: "#7C9A92",
  },
  {
    id: "jazz",
    name: "Light Jazz",
    detail: "Jazz 24",
    url: "https://ice2.somafm.com/jazz24-128-mp3",
    emoji: "🎷",
    hue: "#9B7FAC",
  },
  {
    id: "rock",
    name: "Florence Rock",
    detail: "Indie Pop Rocks",
    url: "https://ice4.somafm.com/indiepop-128-mp3",
    emoji: "🎸",
    hue: "#C07A5A",
  },
  {
    id: "spy",
    name: "Secret Agent",
    detail: "Spy jazz & lounge",
    url: "https://ice4.somafm.com/secretagent-128-mp3",
    emoji: "🕵️",
    hue: "#4A7FA5",
  },
  {
    id: "lounge",
    name: "Cocktail Hour",
    detail: "Illinois St. Lounge",
    url: "https://ice4.somafm.com/illstreet-128-mp3",
    emoji: "🍸",
    hue: "#A5734A",
  },
  {
    id: "space",
    name: "Space Station",
    detail: "Cosmic ambient",
    url: "https://ice2.somafm.com/spacestation-128-mp3",
    emoji: "🌌",
    hue: "#5A4FA5",
  },
  {
    id: "sonic",
    name: "Sonic Universe",
    detail: "Jazz beyond",
    url: "https://ice4.somafm.com/sonicuniverse-128-mp3",
    emoji: "🎹",
    hue: "#7A4FA5",
  },
  {
    id: "drone",
    name: "Drone Zone",
    detail: "Deep ambient",
    url: "https://ice2.somafm.com/dronezone-128-mp3",
    emoji: "🌿",
    hue: "#4A8A6A",
  },
  {
    id: "lush",
    name: "Lush",
    detail: "Dreamy & shoegaze",
    url: "https://ice4.somafm.com/lush-128-mp3",
    emoji: "🌸",
    hue: "#C06A8A",
  },
] as const;

type StationId = (typeof STATIONS)[number]["id"];

export function MusicPlayer() {
  const [stationId, setStationId] = useState<StationId>("jazz");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const station = STATIONS.find(s => s.id === stationId)!;

  const applyVolume = useCallback((audio: HTMLAudioElement) => {
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (!audioRef.current) return;
    applyVolume(audioRef.current);
  }, [volume, muted, applyVolume]);

  // Swap source when station changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = playing;
    audio.pause();
    audio.src = station.url;
    applyVolume(audio);
    if (wasPlaying) {
      setLoading(true);
      audio.load();
      audio.play().catch(() => setPlaying(false)).finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (!audio.src) audio.src = station.url;
      applyVolume(audio);
      setLoading(true);
      audio.load();
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
        .finally(() => setLoading(false));
    }
  };

  const selectStation = (id: StationId) => {
    setStationId(id);
    setShowPicker(false);
  };

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setShowPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  const effectiveVolume = muted ? 0 : volume;

  return (
    <div className="flex items-center gap-2 select-none" style={{ position: "relative" }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />

      {/* Station picker button */}
      <div ref={pickerRef} style={{ position: "relative" }}>
        <button
          onClick={() => setShowPicker(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: showPicker ? "#EDE5DC" : "#F5EFE7",
            border: "1px solid #E3D8CC",
            color: "#4D3F34",
            minWidth: 130,
          }}
          title="Choose station"
        >
          <span style={{ fontSize: 13 }}>{station.emoji}</span>
          <span className="truncate flex-1 text-left" style={{ color: station.hue, fontWeight: 600 }}>
            {station.name}
          </span>
          <ChevronDown
            className="w-3 h-3 flex-shrink-0 transition-transform"
            style={{ color: "#9CA3AF", transform: showPicker ? "rotate(180deg)" : "none" }}
          />
        </button>

        {showPicker && (
          <div
            className="absolute top-full left-0 mt-1.5 rounded-xl overflow-hidden"
            style={{
              background: "#FFFCF7",
              border: "1px solid #EDE5DA",
              boxShadow: "0 8px 24px rgba(80,55,30,0.14)",
              zIndex: 100,
              minWidth: 200,
              maxHeight: 340,
              overflowY: "auto",
            }}
          >
            {STATIONS.map(s => (
              <button
                key={s.id}
                onClick={() => selectStation(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[#F5EFE7]"
                style={{ background: s.id === stationId ? "#F5EFE7" : "transparent" }}
              >
                <span style={{ fontSize: 15 }}>{s.emoji}</span>
                <div>
                  <div className="text-xs font-semibold" style={{ color: s.hue }}>{s.name}</div>
                  <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{s.detail}</div>
                </div>
                {s.id === stationId && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: s.hue }} />
                )}
              </button>
            ))}
            <div className="px-3 py-2 border-t" style={{ borderColor: "#EDE5DA" }}>
              <p className="text-[10px]" style={{ color: "#B8A89A" }}>
                Streaming via SomaFM · free radio
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Play / pause */}
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{
          background: playing ? station.hue : "#EDE5DC",
          border: "1px solid #E3D8CC",
          color: playing ? "white" : "#6B5D54",
          boxShadow: playing ? `0 2px 8px ${station.hue}55` : "none",
        }}
        title={playing ? "Pause" : "Play"}
      >
        {loading
          ? <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin block" />
          : playing
            ? <Pause className="w-3.5 h-3.5" />
            : <Play className="w-3.5 h-3.5 ml-0.5" />
        }
      </button>

      {/* Mute + volume */}
      <button
        onClick={() => setMuted(v => !v)}
        className="p-1.5 rounded-lg transition-colors hover:bg-[#EDE5DC]"
        style={{ color: muted ? "#C07A5A" : "#9CA3AF" }}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted || effectiveVolume === 0
          ? <VolumeX className="w-3.5 h-3.5" />
          : <Volume2 className="w-3.5 h-3.5" />
        }
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={muted ? 0 : volume}
        onChange={e => {
          const v = Number(e.target.value);
          setVolume(v);
          if (v > 0) setMuted(false);
        }}
        className="w-16 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: station.hue,
          background: `linear-gradient(to right, ${station.hue} ${effectiveVolume * 100}%, #E3D8CC ${effectiveVolume * 100}%)`,
        }}
        title={`Volume ${Math.round(effectiveVolume * 100)}%`}
      />

      {/* Live indicator */}
      {playing && !loading && (
        <div className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: station.hue }}
          />
          <span className="text-[10px] font-medium" style={{ color: "#B8A89A" }}>LIVE</span>
        </div>
      )}
    </div>
  );
}
