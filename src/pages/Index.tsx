import { useState } from 'react';
import ImageProcessor from '@/components/ImageProcessor';
import { useDebounce } from '@/hooks/useDebounce';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ImageIcon, ZoomIn, Sparkles, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEEP_FIELD_IMAGES = [
  {
    name: "Webb First Deep Field",
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Webb%27s_First_Deep_Field.jpg',
  },
  {
    name: "Hubble Ultra-Deep Field",
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Hubble_ultra_deep_field_high_rez_edit1.jpg',
  },
];

const Index = () => {
  const [selectedImage, setSelectedImage] = useState(DEEP_FIELD_IMAGES[0]);
  const [brightnessThreshold, setBrightnessThreshold] = useState(100);
  const [objectCount, setObjectCount] = useState(0);

  const debouncedThreshold = useDebounce(brightnessThreshold, 300);

  const handleImageChange = (imageName: string) => {
    const image = DEEP_FIELD_IMAGES.find(img => img.name === imageName);
    if (image) {
      setSelectedImage(image);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full text-foreground p-4 sm:p-8">
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <header className="text-left">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white pb-2">
                Estimate number of galaxies in visible Universe from deep field images
              </h1>
              <div className="text-muted-foreground mt-4 max-w-3xl text-justify space-y-4">
                <p>
                  Most of the objects visible in the deep field images are galaxies: The regions were selected for having only a few foreground objects from our own galaxy, the Milky Way.
                </p>
                <p>
                  The area imaged is about a hundred millionth of the entire sky. So, the total number of galaxies can be estimated to be the number of identified objects × 10⁸.
                </p>
                <p>
                  Zoom into the darkest regions of the image using mouse scroll or zoom buttons, and it is likely that you will see objects that are not identified by the tool. This means that the actual number of objects is more than identified by the tool.
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Image Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={handleImageChange} defaultValue={selectedImage.name}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a deep field image" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEEP_FIELD_IMAGES.map((image) => (
                        <SelectItem key={image.name} value={image.name}>
                          {image.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          <p className="max-w-xs text-justify">
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
                    <p className="text-5xl font-bold text-primary">
                      {objectCount.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center bg-background/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-muted-foreground flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      <span>Est. Galaxies in Visible Universe</span>
                    </h3>
                    <p className="text-3xl font-bold text-primary mt-2">
                      {objectCount > 0 ? `~${Math.round(objectCount / 10).toLocaleString()} billion` : '0'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Based on Identified Objects × 10⁸)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="overflow-hidden sticky top-8">
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
