import { useState, useRef, useEffect } from "react";

export function useMagnetic(range = 90, strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (strength <= 0) return;

    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const nodeCenterX = rect.left + rect.width / 2;
      const nodeCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - nodeCenterX;
      const distanceY = e.clientY - nodeCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        // Calculate dynamic pull strength based on distance (closer = stronger attraction)
        const factor = (1 - distance / range) * strength;
        setPosition({
          x: distanceX * factor,
          y: distanceY * factor,
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, strength]);

  return { ref, position };
}
