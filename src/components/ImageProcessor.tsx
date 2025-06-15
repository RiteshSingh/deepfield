import React, { useRef, useEffect, useState } from 'react';
import { identifyBrightObjects, BoundingBox } from '@/lib/image-processing';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ImageProcessorProps {
  imageUrl: string;
  brightnessThreshold: number;
  onObjectCountChange: (count: number) => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({
  imageUrl,
  brightnessThreshold,
  onObjectCountChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [identifiedObjects, setIdentifiedObjects] = useState<BoundingBox[]>([]);
  
  // Zoom and Pan state
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const resetTransform = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Effect 1: Load image from URL
  useEffect(() => {
    if (!imageUrl) return;
    setIsLoading(true);
    resetTransform(); // Reset zoom/pan when image changes
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error("Failed to load image");
      setIsLoading(false);
    }
  }, [imageUrl]);

  // Effect 2: Identify objects when image is loaded or threshold changes
  useEffect(() => {
    if (!image || isLoading) return;

    // Use an offscreen canvas for processing to not block the main thread
    const processingCanvas = document.createElement('canvas');
    const ctx = processingCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const MAX_WIDTH = 1024;
    const scale = Math.min(1, MAX_WIDTH / image.width);
    const canvasWidth = Math.floor(image.width * scale);
    const canvasHeight = Math.floor(image.height * scale);

    if (canvasRef.current) {
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
    }
    setCanvasSize({ width: canvasWidth, height: canvasHeight });
    
    processingCanvas.width = canvasWidth;
    processingCanvas.height = canvasHeight;
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    let objects: BoundingBox[] = [];
    try {
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
      objects = identifyBrightObjects(
        imageData,
        canvasWidth,
        canvasHeight,
        brightnessThreshold
      );
    } catch (e) {
      console.error("Error getting image data:", e);
      onObjectCountChange(0);
      return;
    }

    onObjectCountChange(objects.length);
    setIdentifiedObjects(objects);

  }, [image, brightnessThreshold, onObjectCountChange, isLoading]);

  // Effect 3: Draw on canvas when image, objects, or transform changes
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Draw the base image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Overlay bounding boxes
    ctx.strokeStyle = 'rgba(50, 205, 50, 0.7)';
    ctx.lineWidth = 1 / zoom; // Keep line width constant

    identifiedObjects.forEach(box => {
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
    
    ctx.restore();
  }, [image, identifiedObjects, zoom, offset, canvasSize]);

  // Handlers for zoom and pan
  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!canvasRef.current) return;
    
    const scaleAmount = -event.deltaY * 0.001;
    const newZoom = Math.max(1, zoom + scaleAmount * zoom);

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const mousePoint = {
      x: (mouseX - offset.x) / zoom,
      y: (mouseY - offset.y) / zoom,
    };
    
    let newOffsetX = mouseX - mousePoint.x * newZoom;
    let newOffsetY = mouseY - mousePoint.y * newZoom;
    
    // Clamp panning to keep image in view
    newOffsetX = Math.min(0, Math.max(canvasSize.width * (1 - newZoom), newOffsetX));
    newOffsetY = Math.min(0, Math.max(canvasSize.height * (1 - newZoom), newOffsetY));

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsPanning(true);
    setPanStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseUp = () => setIsPanning(false);
  const handleMouseLeave = () => setIsPanning(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    let newOffsetX = event.clientX - panStart.x;
    let newOffsetY = event.clientY - panStart.y;
    
    // Clamp panning
    newOffsetX = Math.min(0, Math.max(canvasSize.width * (1 - zoom), newOffsetX));
    newOffsetY = Math.min(0, Math.max(canvasSize.height * (1 - zoom), newOffsetY));

    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  return (
    <div className="relative w-full min-h-[400px] flex items-center justify-center bg-black overflow-hidden rounded-md">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50">
           <Skeleton className="w-[95%] h-[95%]" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
       {!isLoading && (
          <div className="absolute top-4 right-4 z-10">
            <Button variant="secondary" size="icon" onClick={resetTransform} title="Reset view">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        )}
    </div>
  );
};

export default ImageProcessor;
