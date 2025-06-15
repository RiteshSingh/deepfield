
import { useState } from 'react';
import ImageProcessor from '@/components/ImageProcessor';
import { useDebounce } from '@/hooks/useDebounce';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon, ZoomIn } from 'lucide-react';

const DEEP_FIELD_IMAGES = [
  {
    name: 'JWST Deep Field (SMACS 0723)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Webb%27s_First_Deep_Field.jpg',
  },
];

const Index = () => {
  const [selectedImage] = useState(DEEP_FIELD_IMAGES[0]);
  const [brightnessThreshold, setBrightnessThreshold] = useState(100);
  const [objectCount, setObjectCount] = useState(0);

  const debouncedThreshold = useDebounce(brightnessThreshold, 300);

  return (
    <div className="min-h-screen w-full text-foreground p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
          Astro Object Identifier
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Select a deep space image and adjust the brightness threshold to identify stars, galaxies, and other celestial bodies.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Selected Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{selectedImage.name}</p>
              <p className="text-sm text-muted-foreground">More images will be available soon.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ZoomIn className="h-5 w-5" />
                Analysis Controls
              </CardTitle>
              <CardDescription>Adjust the detection parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div>
                <label htmlFor="threshold-slider" className="block text-sm font-medium mb-4">
                  Brightness Threshold
                </label>
                <Slider
                  id="threshold-slider"
                  min={0}
                  max={255}
                  step={1}
                  value={[brightnessThreshold]}
                  onValueChange={(value) => setBrightnessThreshold(value[0])}
                />
                <p className="text-right text-sm text-muted-foreground mt-2">
                  Value: {brightnessThreshold}
                </p>
              </div>

              <div className="text-center bg-background/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-muted-foreground">Identified Objects</h3>
                <p className="text-5xl font-bold text-primary animate-pulse">
                  {objectCount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <ImageProcessor
              imageUrl={selectedImage.url}
              brightnessThreshold={debouncedThreshold}
              onObjectCountChange={setObjectCount}
            />
          </Card>
        </div>
      </main>

      <footer className="text-center mt-12 text-muted-foreground text-sm">
        <p>Built with Lovable. Image credit: NASA, ESA, CSA, and STScI.</p>
      </footer>
    </div>
  );
};

export default Index;
