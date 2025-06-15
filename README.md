
# Galaxy Estimator from Deep Field Images

This web application provides an interactive tool for estimating the number of galaxies in the observable universe based on an analysis of deep field images from the Hubble and James Webb Space Telescopes.

## Scientific Background

Telescopes like the Hubble and JWST can stare at a tiny, seemingly empty patch of the sky for an extended period. This allows them to capture extremely faint light from the most distant galaxies. The resulting images, known as "deep fields," reveal thousands of galaxies in an area of the sky that is just a small fraction of the size of the full moon.

By counting the galaxies in this tiny patch and knowing what fraction of the total sky it represents, we can extrapolate to estimate the total number of galaxies in the entire universe.

## Methodology

The application employs a computational image processing technique to identify and count objects (primarily galaxies) within the selected deep field image.

### 1. Image Pre-processing

The high-resolution source image is first scaled down to a manageable width (e.g., 1024 pixels) to ensure the analysis can be performed efficiently in the browser. This resizing maintains the aspect ratio of the original image.

### 2. Object Identification via Brightness Thresholding

The core of the object detection is a pixel-based analysis algorithm. The user can control a **Brightness Threshold**, which is a value from 0 (black) to 255 (white).

For each pixel in the image, its brightness is calculated as the average of its Red, Green, and Blue (RGB) color values:

`Brightness = (R + G + B) / 3`

A pixel is considered part of a celestial object if its calculated brightness is greater than or equal to the user-defined `Brightness Threshold`.

### 3. Bounding Box Creation via Flood Fill Algorithm

Once a bright pixel is identified, the application needs to determine the full extent of the object it belongs to. This is achieved using a **Flood Fill (or Seed Fill)** algorithm, a common technique in computer graphics. Here is a step-by-step description of how it works:

1.  **Initialization**: The algorithm begins when it finds a pixel that is above the brightness threshold and has not yet been assigned to an object. This pixel becomes the "seed" for a new potential object.

2.  **Breadth-First Search (BFS)**: A queue is initialized with the seed pixel. The algorithm then explores its neighbors.

3.  **Expansion**: The algorithm checks all 8 neighboring pixels (horizontally, vertically, and diagonally). If a neighbor is also above the brightness threshold and hasn't been visited yet, it is added to the queue and marked as part of the current object.

4.  **Iteration**: This process repeats, taking the next pixel from the queue and checking its neighbors, until the queue is empty. This means all connected bright pixels have been found and grouped together.

5.  **Bounding Box Calculation**: Throughout the flood fill process, the algorithm keeps track of the minimum and maximum X and Y coordinates (`minX`, `minY`, `maxX`, `maxY`) of all pixels belonging to the object. Once the fill is complete, these coordinates are used to define a rectangular bounding box that encloses the entire object.

This process is repeated for the entire image until every pixel has been visited, resulting in a list of all identified objects, each with its own bounding box.

### 4. Galaxy Count Estimation

The area of the sky captured in these deep field images is approximately **1 / 26,000,000th** of the entire celestial sphere. The total number of galaxies in the observable universe can be estimated by extrapolating the count from our sample:

`Estimated Total Galaxies = (Number of Identified Objects) × 26,000,000`

The application calculates this value and presents it in billions for readability.

## Limitations

This tool provides a simplified estimation and is subject to several limitations:
-   **Threshold Sensitivity**: The number of identified objects is highly dependent on the chosen brightness threshold.
-   **Object Merging**: At lower thresholds, distinct but close-together galaxies may be merged into a single bounding box.
-   **Faint Objects**: Many of the faintest, most distant galaxies may fall below any selectable brightness threshold and will not be counted.
-   **Foreground Stars**: A few of the bright objects are foreground stars within our own Milky Way galaxy, not distant galaxies.

Despite these limitations, the application serves as a powerful educational tool for demonstrating the principles behind how astronomers arrive at these monumental figures.

## Image Credits

-   **Webb's First Deep Field**: NASA, ESA, CSA, and STScI
-   **Hubble Ultra-Deep Field**: NASA, ESA, and S. Beckwith (STScI) and the HUDF Team
-   Images sourced from Wikimedia Commons.

## Technology Stack

This project is built with:
-   Vite
-   TypeScript
-   React
-   shadcn-ui
-   Tailwind CSS
