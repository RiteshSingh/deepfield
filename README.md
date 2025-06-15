
# Galaxy Estimator from Deep Field Images

## Overview

This web application provides an interactive tool to estimate the number of galaxies in the observable universe based on iconic deep field images from the Hubble and James Webb space telescopes. Users can analyze these images, adjust detection parameters, and see in real-time how many celestial objects are identified.

## How it Works

The application operates on a simple yet powerful principle: if we can count the number of galaxies in a small, known fraction of the sky, we can extrapolate that number to estimate the total number of galaxies in the entire sky.

The deep field images used here represent a tiny slice of the celestial sphere—approximately **a 26-millionth** of the total sky. By identifying and counting the galaxies in one of these images, we can multiply that count by 26 million to arrive at a rough estimate for the entire universe.

The core of this application is its image processing engine, which algorithmically identifies bright objects (mostly galaxies) within the selected image.

## Object Identification Algorithm

The process of identifying distinct objects in the image is central to the application's functionality. It involves a pixel-level analysis to isolate groups of bright pixels that constitute a single object, such as a galaxy or a star. Here’s a detailed breakdown of the steps involved:

### 1. Pixel Scanning

The algorithm systematically scans the image pixel by pixel, from left to right and top to bottom. For each pixel, it determines if it could be part of a celestial object.

### 2. Brightness Calculation

For every pixel, its color information (Red, Green, Blue values, each from 0-255) is converted into a single brightness value. This is done using a simple averaging formula:

`Brightness = (R + G + B) / 3`

This value, ranging from 0 (pure black) to 255 (pure white), represents the pixel's luminosity.

### 3. Thresholding

The calculated brightness is compared against a user-defined **Brightness Threshold**.
- If a pixel's brightness is **above** this threshold, it is considered "bright" and potentially part of an object.
- If it's **below**, it's considered part of the dark background sky and is ignored.

This threshold is the primary control given to the user. A lower threshold allows the detection of fainter objects, but may also cause nearby objects to merge. A higher threshold helps separate objects but may miss dimmer ones.

### 4. Flood Fill and Object Grouping

When the algorithm finds a "bright" pixel that hasn't been assigned to an object yet, it initiates a **Flood Fill** algorithm from that pixel's location. This algorithm works as follows:
- It creates a queue and adds the starting bright pixel to it.
- It explores all 8 neighboring pixels (horizontally, vertically, and diagonally).
- If a neighbor is also a "bright" pixel (i.e., its brightness is above the threshold), it is marked as part of the *same object* and added to the queue for its own neighbors to be explored.
- This process continues until all connected bright pixels have been found and grouped together. A `visited` map is maintained to ensure no pixel is processed more than once.

This effectively "floods" an entire galaxy or star, grouping all its constituent bright pixels into a single entity.

### 5. Bounding Box Creation

As the Flood Fill algorithm identifies all the pixels belonging to a single object, it keeps track of the extreme coordinates of that group:
- `minX`: The leftmost pixel's x-coordinate.
- `minY`: The topmost pixel's y-coordinate.
- `maxX`: The rightmost pixel's x-coordinate.
- `maxY`: The bottommost pixel's y-coordinate.

Once the flood fill for an object is complete, these four values are used to define a rectangular **bounding box** that perfectly encloses the entire object. The box is defined by its top-left corner (`minX`, `minY`), its `width` (`maxX - minX + 1`), and its `height` (`maxY - minY + 1`).

This process is repeated across the entire image until every pixel has been visited, resulting in a list of bounding boxes, each representing one identified object. These boxes are then drawn on the canvas for the user to see.

## How to Use the App

1.  **Select an Image**: Choose between different deep field images using the dropdown menu.
2.  **Adjust Brightness Threshold**: Use the slider to change the brightness threshold. Observe how the number of identified objects changes. Try to find a value that maximizes the count of distinct objects without merging them.
3.  **Explore the Image**: Use your mouse wheel or the on-screen buttons to zoom in and out. Click and drag to pan across the image to inspect different regions.
4.  **View the Results**: The "Identified Objects" card shows the current count based on your settings. The "Estimated Galaxies" card shows the extrapolated number for the entire visible universe.

## Image Credits

- **Webb's First Deep Field**: NASA, ESA, CSA, and STScI
- **Hubble Ultra-Deep Field**: NASA, ESA, S. Beckwith (STScI) and the HUDF Team

This project is for educational and demonstrative purposes. The estimation is a simplified model and the actual number of galaxies is a topic of ongoing scientific research.
