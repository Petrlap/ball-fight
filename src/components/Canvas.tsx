import React, { useCallback, useEffect, useRef } from "react";
import { CanvasProps } from "../types";

function Canvas({
  isGameActive,
  setIsColorMenuOpen,
  setSelectedBall,
  ballsRef,
}: CanvasProps) {
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateRandomBall = useCallback(() => {
    const canvasWidth = canvasRef.current?.width || 500;
    const canvasHeight = canvasRef.current?.height || 500;
    const radius = 30;
    const x = Math.random() * (canvasWidth - 2 * radius) + radius;
    const y = Math.random() * (canvasHeight - 2 * radius) + radius;
    const dx = 0;
    const dy = 0;
    const color = "#100720";
    const id = ballsRef.current.length + 1;

    return { id, x, y, radius, color, dx, dy };
  }, []);
  const handleBallClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (ballsRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas?.getBoundingClientRect();
        const mouseX = e.clientX - rect!.left;
        const mouseY = e.clientY - rect!.top;

        const clickedBall = ballsRef.current.find((ball) => {
          const dx = ball.x - mouseX;
          const dy = ball.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= ball.radius;
        });

        if (clickedBall) {
          setSelectedBall(clickedBall);
          setIsColorMenuOpen(true);
        }
      }
    },
    []
  );

  useEffect(() => {
    const balls = Array.from({ length: 5 }, generateRandomBall);
    ballsRef.current = balls;
  }, [generateRandomBall]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ballsRef.current.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
      });
    };

    const update = () => {
      if (!isGameActive) {
        render();
        return;
      }

      ballsRef.current.forEach((ball, index) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        ball.dx *= 0.99;
        ball.dy *= 0.99;

        // Отражение от стен
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvasWidth) {
          ball.dx = -ball.dx;
          // Если шар выходит за границы по x, устанавливаем его обратно в пределы холста
          if (ball.x - ball.radius < 0) ball.x = ball.radius;
          if (ball.x + ball.radius > canvasWidth)
            ball.x = canvasWidth - ball.radius;
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
          ball.dy = -ball.dy;
          // Если шар выходит за границы по y, устанавливаем его обратно в пределы холста
          if (ball.y - ball.radius < 0) ball.y = ball.radius;
          if (ball.y + ball.radius > canvasHeight)
            ball.y = canvasHeight - ball.radius;
        }

        // Отталкивание от других шаров
        for (let i = index + 1; i < ballsRef.current.length; i++) {
          const otherBall = ballsRef.current[i];
          const dx = otherBall.x - ball.x;
          const dy = otherBall.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ball.radius + otherBall.radius;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const moveX = (overlap * dx) / distance;
            const moveY = (overlap * dy) / distance;

            ball.x -= moveX * 0.5;
            ball.y -= moveY * 0.5;
            otherBall.x += moveX * 0.5;
            otherBall.y += moveY * 0.5;

            const nx = dx / distance;
            const ny = dy / distance;
            const tx = -ny;
            const ty = nx;

            const dpTan1 = ball.dx * tx + ball.dy * ty;
            const dpTan2 = otherBall.dx * tx + otherBall.dy * ty;
            const dpNorm1 = ball.dx * nx + ball.dy * ny;
            const dpNorm2 = otherBall.dx * nx + otherBall.dy * ny;

            const m1 = 1;
            const m2 = 1;

            const m1Temp = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
            const m2Temp = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

            ball.dx = tx * dpTan1 + nx * m1Temp;
            ball.dy = ty * dpTan1 + ny * m1Temp;
            otherBall.dx = tx * dpTan2 + nx * m2Temp;
            otherBall.dy = ty * dpTan2 + ny * m2Temp;
          }
        }

        // Отталкивание от курсора
        if (mouseRef.current) {
          const dx = ball.x - mouseRef.current.x;
          const dy = ball.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 40;
          const forceMultiplier = 0.1;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            ball.dx += dx * force * forceMultiplier;
            ball.dy += dy * force * forceMultiplier;
          }
        }
      });

      render();
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
    };

    canvas.addEventListener("mousemove", mouseMoveHandler);

    const animationId = setInterval(update, 1000 / 60);

    return () => {
      clearInterval(animationId);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [isGameActive]);

  return (
    <div className="container">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="canvas"
        onClick={handleBallClick}
      />
    </div>
  );
}

export default Canvas;
