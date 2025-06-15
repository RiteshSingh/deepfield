
interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getBrightness(r: number, g: number, b: number): number {
  return (r + g + b) / 3;
}

function floodFill(
  x: number,
  y: number,
  width: number,
  height: number,
  imageData: Uint8ClampedArray,
  threshold: number,
  visited: boolean[][]
): BoundingBox {
  const queue: Point[] = [{ x, y }];
  visited[y][x] = true;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  let minX = x, minY = y, maxX = x, maxY = y;

  while (queue.length > 0) {
    const { x: cx, y: cy } = queue.shift()!;

    minX = Math.min(minX, cx);
    minY = Math.min(minY, cy);
    maxX = Math.max(maxX, cx);
    maxY = Math.max(maxY, cy);

    for (const [dx, dy] of directions) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
        const pixelIndex = (ny * width + nx) * 4;
        const r = imageData[pixelIndex];
        const g = imageData[pixelIndex + 1];
        const b = imageData[pixelIndex + 2];
        const brightness = getBrightness(r, g, b);

        if (brightness >= threshold) {
          visited[ny][nx] = true;
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function identifyBrightObjects(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): BoundingBox[] {
  if (!imageData || width === 0 || height === 0) {
    return [];
  }

  const visited: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
  const objects: BoundingBox[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (visited[y][x]) {
        continue;
      }

      const pixelIndex = (y * width + x) * 4;
      const r = imageData[pixelIndex];
      const g = imageData[pixelIndex + 1];
      const b = imageData[pixelIndex + 2];
      const brightness = getBrightness(r, g, b);

      if (brightness >= threshold) {
        const boundingBox = floodFill(x, y, width, height, imageData, threshold, visited);
        objects.push(boundingBox);
      }
      
      visited[y][x] = true;
    }
  }

  return objects;
}
