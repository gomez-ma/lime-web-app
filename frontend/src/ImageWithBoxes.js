import { useEffect, useRef } from "react";

export default function ImageWithBoxes({ image, boxes }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.font = "16px Arial";

      boxes.forEach((b) => {
        const [x1, y1, x2, y2] = b.bbox;

        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        ctx.fillStyle = "red";
        ctx.fillText(
          `${b.label} (${(b.confidence * 100).toFixed(1)}%)`,
          x1,
          y1 - 5
        );
      });
    };
  }, [image, boxes]);

  return <canvas ref={canvasRef} />;
}