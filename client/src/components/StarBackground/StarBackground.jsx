import React, { useEffect, useRef } from "react";
import { initStars } from "../../utils/starLogic.js";

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas ref not yet available.");
      return;
    }

    initStars(canvas.id);

    return () => {};
  }, []);

  return (
    <canvas
      id="starbg"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
