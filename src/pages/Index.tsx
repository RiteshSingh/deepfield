import { useState } from 'react';
import ImageProcessor from '@/components/ImageProcessor';
import { useDebounce } from '@/hooks/useDebounce';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon, ZoomIn, Sparkles, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

const DEEP_FIELD_IMAGES = [
  {
    name: "Webb's First Deep Field",
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Webb%27s_First_Deep_Field.jpg',
  },
];

const Index = () => {
  const [selectedImage] = useState(DEEP_FIELD_IMAGES[0]);
  const [brightnessThreshold, setBrightnessThreshold] = useState(100);
  const [objectCount, setObjectCount] = useState(0);

  const debouncedThreshold = useDebounce(brightnessThreshold, 300);

  return (
    <TooltipProvider>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 cursor-help">
                          Brightness Threshold
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          The Brightness Threshold is the pixel value above which the tool considers a pixel as bright, and below which it considers a pixel as dark.
                          <br /><br />
                          The lower the Brightness Threshold, the dimmer the object which can be identified. However, if it is too low, some of the objects start getting clubbed into one object.
                          <br /><br />
                          Try to select the Brightness Threshold so as to identify as many objects accurately as possible.
                        </p>
                      </TooltipContent>
                    </Tooltip>
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

                <div className="text-center bg-background/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-muted-foreground flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          <span>Est. Galaxies in Visible Universe</span>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Most of the identified objects in the deep field image are galaxies. This is because the region was selected for having one of the least number of objects from our own galaxy, the Milky Way.
                          <br /><br />
                          The area imaged is about ten billionth of the entire sky. So, the total number of galaxies can be estimated to be the number of identified objects × 10⁸.
                          <br /><br />
                          Zoom into the darkest regions of the image using mouse scroll and it is likely that you will see objects that are not identified by the tool. This means that the actual number of objects is more than identified by the tool.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h3>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {objectCount > 0 ? `~${(objectCount * 1e8).toExponential(2)}` : '0'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Based on Identified Objects × 10⁸)
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
    </TooltipProvider>
  );
};

export default Index;
