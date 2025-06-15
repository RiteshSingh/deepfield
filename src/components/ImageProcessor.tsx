
import React, { useRef, useEffect, useState } from 'react';
import { identifyBrightObjects } from '@/lib/image-processing';
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
  const [imageData, setImageData] = useState<Uint8ClampedArray | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) return;
    setIsLoading(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const MAX_WIDTH = 1024;
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvasWidth = img.width * scale;
      const canvasHeight = img.height * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      
      try {
        const data = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
        setImageData(data);
        setImageSize({ width: canvasWidth, height: canvasHeight });
      } catch (e) {
        console.error("Error getting image data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    img.onerror = () => {
      console.error("Failed to load image");
      setIsLoading(false);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (!imageData || isLoading) return;

    const objectCount = identifyBrightObjects(
      imageData,
      imageSize.width,
      imageSize.height,
      brightnessThreshold
    );
    onObjectCountChange(objectCount);

  }, [brightnessThreshold, imageData, imageSize, onObjectCountChange, isLoading]);

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
