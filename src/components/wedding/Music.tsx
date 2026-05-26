'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface MusicProps {
  musicUrl?: string;
  musicEnabled?: boolean;
}

export default function Music({ musicUrl = '', musicEnabled = false }: MusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingPlayRef = useRef(false);

  const videoId = extractYouTubeId(musicUrl);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || !window.YT?.Player || !videoId) return;

    const onReady = () => {
      if (playerRef.current) {
        playerRef.current.setVolume(30);
        if (pendingPlayRef.current) {
          playerRef.current.playVideo();
          setIsPlaying(true);
          pendingPlayRef.current = false;
        }
      }
    };

    playerRef.current = new window.YT.Player(containerRef.current, {
      height: '0',
      width: '0',
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: videoId,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady,
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            playerRef.current?.playVideo();
          }
        },
      },
    });
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = initPlayer;

    if (window.YT?.Player) {
      initPlayer();
    }

    const handleOpen = () => {
      if (playerRef.current) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } else {
        pendingPlayRef.current = true;
      }
    };
    window.addEventListener('wedding:open', handleOpen);

    return () => {
      delete window.onYouTubeIframeAPIReady;
      window.removeEventListener('wedding:open', handleOpen);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [initPlayer, videoId]);

  const toggleMusic = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  // Don't show music button if no URL or disabled
  if (!videoId || !musicEnabled) return null;

  return (
    <>
      <div ref={containerRef} className="hidden" />
      <button
        onClick={toggleMusic}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isPlaying 
            ? 'bg-[#8B5E3C] text-white hover:bg-[#7A4E2C]' 
            : 'bg-white text-[#8B5E3C] hover:bg-[#F5E6D3]'
        }`}
        title={isPlaying ? 'Matikan musik' : 'Putar musik'}
      >
        {isPlaying ? (
          <FiVolume2 className="text-lg animate-pulse" />
        ) : (
          <FiVolumeX className="text-lg" />
        )}
      </button>
    </>
  );
}
