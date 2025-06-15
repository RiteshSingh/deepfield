
interface Point {
  x: number;
  y: number;
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
): void {
  const queue: Point[] = [{ x, y }];
  visited[y][x] = true;
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  while (queue.length > 0) {
    const { x: cx, y: cy } = queue.shift()!;

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
}

export function identifyBrightObjects(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number
): number {
  if (!imageData || width === 0 || height === 0) {
    return 0;
  }

  const visited: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
  let objectCount = 0;

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
        objectCount++;
        floodFill(x, y, width, height, imageData, threshold, visited);
      }
      
      visited[y][x] = true;
    }
  }

  return objectCount;
}
