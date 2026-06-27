import React, { useState, useEffect, ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

interface SafeResponsiveContainerProps {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  id?: string;
}

export default function SafeResponsiveContainer({
  children,
  width = "100%",
  height = "100%",
  minWidth = 0,
  minHeight = 0,
  id
}: SafeResponsiveContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // A microtask or small timeout ensures the browser has painted the layout
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ 
          width: typeof width === "number" ? `${width}px` : width, 
          height: typeof height === "number" ? `${height}px` : height,
          minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
          minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        }} 
        className="w-full h-full bg-slate-950/20 rounded animate-pulse"
      />
    );
  }

  return (
    <ResponsiveContainer 
      width={width} 
      height={height} 
      minWidth={minWidth} 
      minHeight={minHeight}
      id={id}
    >
      {children}
    </ResponsiveContainer>
  );
}
