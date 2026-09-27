import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

/**
 * PosturaChecker
 * Prueba de concepto: corrección de postura en sentadilla usando visión artificial.
 * - Detecta 33 puntos clave del cuerpo con MediaPipe Pose Landmarker.
 * - Calcula el ángulo de la rodilla (cadera-rodilla-tobillo) y la inclinación
 *   de la espalda (hombro-cadera-rodilla).
 * - Dibuja el esqueleto en verde si la postura está dentro del rango
 *   aceptable, o en rojo con un mensaje si no lo está.
 *
 * Uso: <PosturaChecker /> dentro de cualquier página/ruta de la app.
 */

// Índices de landmarks de MediaPipe Pose (lado izquierdo del cuerpo)
const LEFT_SHOULDER = 11;
const LEFT_HIP = 23;
const LEFT_KNEE = 25;
const LEFT_ANKLE = 27;

// Rangos "aceptables" para una sentadilla en posición baja.
// Ajusta estos valores según tus pruebas reales — son un punto de partida.
const KNEE_ANGLE_MIN = 70;
const KNEE_ANGLE_MAX = 100;
const BACK_ANGLE_MIN = 45; // respecto a la vertical; espalda muy inclinada = ángulo menor

/** Calcula el ángulo (en grados) formado por tres puntos, con "b" como vértice. */
function calcularAngulo(a, b, c) {
  const anguloRad =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angulo = Math.abs((anguloRad * 180.0) / Math.PI);
  if (angulo > 180) angulo = 360 - angulo;
  return angulo;
}

export default function PosturaChecker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const rafIdRef = useRef(null);

  const [estado, setEstado] = useState("Cargando modelo...");
  const [anguloRodilla, setAnguloRodilla] = useState(null);
  const [posturaCorrecta, setPosturaCorrecta] = useState(null);

  useEffect(() => {
    let stream;

    async function iniciar() {
      // 1. Cargar el modelo PoseLandmarker (WASM + modelo .task desde CDN de Google)
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      // 2. Pedir acceso a la cámara
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
      });
      videoRef.current.play();

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      setEstado("Detectando...");
      loop();
    }

    function loop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !poseLandmarkerRef.current) return;

      const ctx = canvas.getContext("2d");
      const ahora = performance.now();
      const resultado = poseLandmarkerRef.current.detectForVideo(video, ahora);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (resultado.landmarks && resultado.landmarks.length > 0) {
        const puntos = resultado.landmarks[0];

        const hombro = puntos[LEFT_SHOULDER];
        const cadera = puntos[LEFT_HIP];
        const rodilla = puntos[LEFT_KNEE];
        const tobillo = puntos[LEFT_ANKLE];

        const anguloRodillaCalc = calcularAngulo(cadera, rodilla, tobillo);
        const anguloEspalda = calcularAngulo(hombro, cadera, rodilla);

        const rodillaOk =
          anguloRodillaCalc >= KNEE_ANGLE_MIN && anguloRodillaCalc <= KNEE_ANGLE_MAX;
        const espaldaOk = anguloEspalda >= BACK_ANGLE_MIN;
        const correcta = rodillaOk && espaldaOk;

        setAnguloRodilla(Math.round(anguloRodillaCalc));
        setPosturaCorrecta(correcta);

        // Dibujar esqueleto: verde si la postura es correcta, rojo si no
        const drawingUtils = new DrawingUtils(ctx);
        const color = correcta ? "#22c55e" : "#ef4444";
        drawingUtils.drawLandmarks(puntos, { color, radius: 4 });
        drawingUtils.drawConnectors(puntos, PoseLandmarker.POSE_CONNECTIONS, {
          color,
          lineWidth: 3,
        });

        // Mensaje de retroalimentación sobre el canvas
        ctx.fillStyle = color;
        ctx.font = "24px sans-serif";
        ctx.fillText(
          correcta ? "Postura correcta" : "Corrige la postura",
          20,
          40
        );
        if (!rodillaOk) {
          ctx.fillText("Ajusta la profundidad de la sentadilla", 20, 70);
        }
        if (!espaldaOk) {
          ctx.fillText("Espalda muy inclinada", 20, 100);
        }
      }

      ctx.restore();
      rafIdRef.current = requestAnimationFrame(loop);
    }

    iniciar().catch((err) => {
      console.error("Error iniciando PosturaChecker:", err);
      setEstado("Error: revisa permisos de cámara o la consola");
    });

    // Limpieza al desmontar el componente
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (poseLandmarkerRef.current) poseLandmarkerRef.current.close();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
      <h2>Corrección de postura — Sentadilla</h2>
      <p>Estado: {estado}</p>
      {anguloRodilla !== null && (
        <p>
          Ángulo de rodilla: <strong>{anguloRodilla}°</strong> —{" "}
          <strong style={{ color: posturaCorrecta ? "#22c55e" : "#ef4444" }}>
            {posturaCorrecta ? "Correcta" : "Corregir"}
          </strong>
        </p>
      )}

      {/* El <video> se mantiene oculto; solo se ve el <canvas> con el dibujo superpuesto */}
      <video ref={videoRef} style={{ display: "none" }} playsInline muted />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", borderRadius: 8, border: "1px solid #333" }}
      />
    </div>
  );
}