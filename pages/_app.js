import "../styles/buttons.css";
import "../styles/reveal.css";
import { useEffect, useRef } from "react";

export default function MyApp({ Component, pageProps }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.loop = true;

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay may be blocked until a user gesture
      });
    };

    tryPlay();

    const handleFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, {
      once: true,
    });
    window.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      <Component {...pageProps} />
    </>
  );
}
