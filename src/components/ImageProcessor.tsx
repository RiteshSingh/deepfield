
import React, { useRef, useEffect, useState } from 'react';
import { identifyBrightObjects, BoundingBox } from '@/lib/image-processing';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Effect 1: Load image from URL
  useEffect(() => {
    if (!imageUrl) return;
    setIsLoading(true);
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

  // Effect 2: Process and draw when image is loaded or threshold changes
  useEffect(() => {
    if (!image || isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const MAX_WIDTH = 1024;
    const scale = Math.min(1, MAX_WIDTH / image.width);
    const canvasWidth = Math.floor(image.width * scale);
    const canvasHeight = Math.floor(image.height * scale);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the base image first
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
      return; // Stop if we can't process
    }

    onObjectCountChange(objects.length);

    // Overlay bounding boxes
    ctx.strokeStyle = 'rgba(50, 205, 50, 0.7)';
    ctx.lineWidth = 1;
    
    objects.forEach(box => {
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
    
  }, [image, brightnessThreshold, onObjectCountChange, isLoading]);

  return (
    <div className="relative w-full min-h-[400px] flex items-center justify-center bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50">
           <Skeleton className="w-[95%] h-[95%]" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
};

export default ImageProcessor;
