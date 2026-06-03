"use client";

import { useState } from "react";
import { getBgmTrack, selectableBgmTracks, type BgmTrackId } from "@/lib/bgm-config";
import { useBgm } from "@/hooks/useBgm";
import { useLanguage } from "@/hooks/useLanguage";
import { translations } from "@/lib/translations";

export function BgmControls({ compact = false }: { compact?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const language = useLanguage((state) => state.language);
  const isMuted = useBgm((state) => state.isMuted);
  const isStarted = useBgm((state) => state.isStarted);
  const playbackMode = useBgm((state) => state.playbackMode);
  const selectionMode = useBgm((state) => state.selectionMode);
  const selectedTrackId = useBgm((state) => state.selectedTrackId);
  const selectTrack = useBgm((state) => state.selectTrack);
  const setSelectionMode = useBgm((state) => state.setSelectionMode);
  const setVolume = useBgm((state) => state.setVolume);
  const toggleMuted = useBgm((state) => state.toggleMuted);
  const volume = useBgm((state) => state.volume);
  const t = translations[language];
  const track = getBgmTrack(selectedTrackId);
  const status = !isStarted ? t.musicReady : playbackMode === "fallback" ? t.musicOriginalLoop : t.musicFileTrack;

  return (
    <div className={`bgm-control ${compact ? "bgm-control-compact" : ""} ${isExpanded ? "expanded" : ""}`}>
      <button
        aria-expanded={compact ? undefined : isExpanded}
        aria-label={compact ? (isMuted ? t.unmute : t.mute) : t.musicSettings}
        aria-pressed={compact ? isMuted : undefined}
        className="bgm-settings-button"
        type="button"
        onClick={() => {
          if (compact) {
            toggleMuted();
            return;
          }
          setIsExpanded((current) => !current);
        }}
      >
        <span aria-hidden="true">{isMuted ? "♪×" : "♪"}</span>
      </button>
      {!compact && isExpanded && (
        <div className="bgm-control-panel">
          <span className="bgm-control-copy">
            <strong>{t.music}</strong>
            <small>
              {language === "zh" ? track.labelZh : track.labelEn} {"//"} {status}
            </small>
          </span>
          <button className="bgm-panel-mute-button" type="button" onClick={toggleMuted}>
            {isMuted ? t.unmute : t.mute}
          </button>
          <label className="bgm-volume">
            <span>{t.volume}</span>
            <input
              aria-label={t.volume}
              max="100"
              min="0"
              step="5"
              type="range"
              value={Math.round(volume * 100)}
              onChange={(event) => setVolume(Number(event.currentTarget.value) / 100)}
            />
          </label>
          <label className="bgm-track-picker">
            <span className="sr-only">{t.musicTrack}</span>
            <select
              aria-label={t.musicTrack}
              value={selectionMode === "auto" ? "auto" : selectedTrackId}
              onChange={(event) => {
                const nextValue = event.currentTarget.value;
                if (nextValue === "auto") {
                  setSelectionMode("auto");
                  return;
                }
                selectTrack(nextValue as BgmTrackId);
              }}
            >
              <option value="auto">{t.musicAuto}</option>
              {selectableBgmTracks.map((option) => (
                <option key={option.id} value={option.id}>
                  {language === "zh" ? option.labelZh : option.labelEn}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
