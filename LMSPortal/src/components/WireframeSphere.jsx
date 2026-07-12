import React, { useEffect, useRef } from 'react';

export default function WireframeSphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = canvas.width = 400;
    let height = canvas.height = 400;
    
    let rotationX = 0.4;
    let rotationY = 0.5;
    let time = 0;
    
    // Wake-up power-on sequence modifiers
    let wakeUpFactor = 0.0;
    let wakeUpSpeed = 18.0;

    // Handle resizing or high-DPI using stable window resize event
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      width = canvas.width;
      height = canvas.height;
    };
    window.addEventListener('resize', resize);
    resize();

    // 3D Sphere Points
    const points = [];
    const numLat = 18;
    const numLong = 18;
    const radius = 175;

    for (let i = 0; i <= numLat; i++) {
      const lat = (i * Math.PI) / numLat - Math.PI / 2;
      for (let j = 0; j < numLong; j++) {
        const lon = (j * 2 * Math.PI) / numLong;
        points.push({ lat, lon });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Interpolate the wake-up values to default
      wakeUpFactor += (1.0 - wakeUpFactor) * 0.045; // Smooth expand
      wakeUpSpeed += (1.0 - wakeUpSpeed) * 0.035;   // Slow down from spin-up
      
      time += 0.008 * wakeUpSpeed;
      rotationY += 0.003 * wakeUpSpeed;
      rotationX = 0.35 + Math.sin(time * 0.15) * 0.08;

      // Project and draw
      const projected = points.map(p => {
        // Add waving noise to radius to create the organic look
        const wave = Math.sin(p.lat * 4 + time * 1.5) * Math.cos(p.lon * 4 + time * 1.5) * 14;
        const r = (radius + wave) * wakeUpFactor;

        // Spherical to Cartesian coordinates
        let x = r * Math.cos(p.lat) * Math.cos(p.lon);
        let y = r * Math.sin(p.lat);
        let z = r * Math.cos(p.lat) * Math.sin(p.lon);

        // Rotate Y
        let x1 = x * Math.cos(rotationY) - z * Math.sin(rotationY);
        let z1 = x * Math.sin(rotationY) + z * Math.cos(rotationY);

        // Rotate X
        let y2 = y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        // Perspective projection
        const scale = 320 / (320 + z2);
        // Center the projection on canvas
        const projX = width / 2 + x1 * scale;
        const projY = height / 2 + y2 * scale;

        return { x: projX, y: projY };
      });

      // Draw lines matching the current theme's primary color
      const computedStyle = window.getComputedStyle(canvas);
      const primaryColor = computedStyle.getPropertyValue('--primary').trim() || '#ff6b35';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = window.devicePixelRatio * 0.95;
      ctx.globalAlpha = 0.7;

      // Draw Latitudes
      for (let i = 0; i <= numLat; i++) {
        ctx.beginPath();
        for (let j = 0; j <= numLong; j++) {
          const idx = i * numLong + (j % numLong);
          const p = projected[idx];
          if (p) {
            if (j === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      // Draw Longitudes
      for (let j = 0; j < numLong; j++) {
        ctx.beginPath();
        for (let i = 0; i <= numLat; i++) {
          const idx = i * numLong + j;
          const p = projected[idx];
          if (p) {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: '100%', 
        aspectRatio: '1 / 1', 
        maxHeight: '100%', 
        objectFit: 'contain', 
        display: 'block', 
        margin: 'auto' 
      }} 
    />
  );
}
