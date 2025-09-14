# Spritesheet Generator

A React-based application for creating and previewing spritesheets using the Liberated Pixel Cup (LPC) format. This tool allows you to generate walk cycles, run animations, combat moves, and more with customizable pixel art characters.

![LPC Animation Generator](https://img.shields.io/badge/React-18.2.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![LPC Compatible](https://img.shields.io/badge/LPC-Compatible-orange.svg)

## Features

### 🎮 Animation Support
- **11 Different Animations**: Walk, Run, Jump, Idle, Sit, Cast Spell, Slash, Thrust, Shoot Bow, Hurt, Climb
- **4-Directional Movement**: Up (North), Down (South), Left (West), Right (East)
- **Realistic Frame Counts**: Based on actual LPC animation standards
- **Smooth Animation Playback**: Customizable frame rates from 1 FPS to 20 FPS

### 🎨 Character Customization
- **Modular Character Parts**: Body, Head, Hair, Clothing, Accessories
- **Real-time Preview**: See changes instantly as you customize
- **Direction-based Variations**: Different appearances for each facing direction
- **Pixel-perfect Rendering**: Authentic pixelated display

### 🛠 Interactive Controls
- **Play/Pause/Reset**: Full animation control
- **Frame-by-frame Navigation**: Click any frame to jump to it
- **Speed Control**: Adjust animation timing with slider
- **Scale Control**: Zoom from 1x to 8x for detailed viewing
- **Export Functionality**: Save current frame as PNG

### 📊 Animation Information
- **Detailed Frame Info**: Current frame, total frames, duration
- **Animation Descriptions**: Learn about each animation type
- **Technical Specifications**: Frame rates, timings, and LPC standards

## Quick Start

### Prerequisites
- Node.js 14.0 or higher
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
```bash
# If using git
git clone <repository-url>
cd lpc-animation-generator

# Or extract the provided files to this directory
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm start
# or
yarn start
```

4. **Open in browser**
```
http://localhost:3001
```

## Project Structure

```
lpc-animation-generator/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── AnimationPreview.js      # Main animation canvas
│   │   ├── AnimationControls.js     # Speed controls
│   │   ├── AnimationInfo.js         # Information panel
│   │   ├── AnimationSettings.js     # Animation/direction selection
│   │   ├── AttributionNotice.js     # LPC licensing info
│   │   ├── CharacterCustomization.js # Character part toggles
│   │   ├── ConfigurationPanel.js    # Right sidebar container
│   │   ├── FrameSelector.js         # Frame navigation
│   │   └── Header.js                # App header
│   ├── hooks/
│   │   └── useAnimation.js  # Animation state management
│   ├── utils/
│   │   ├── animationUtils.js       # Animation timing utilities
│   │   ├── characterRenderer.js    # Character drawing functions
│   │   └── constants.js            # App constants
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   └── index.js            # React entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Usage Guide

### Basic Animation Playback

1. **Select Animation Type**: Choose from walk, run, jump, etc. in the dropdown
2. **Choose Direction**: Select which way the character faces
3. **Adjust Scale**: Use the scale slider to zoom in/out
4. **Control Playback**: Use Play/Pause/Reset buttons
5. **Navigate Frames**: Click frame numbers to jump to specific frames

### Character Customization

1. **Toggle Parts**: Check/uncheck body parts in the customization panel
2. **Real-time Updates**: Changes appear immediately in the preview
3. **Part Descriptions**: Hover over parts to see what they control

### Animation Settings

- **Speed Control**: Drag slider to change animation speed (50ms - 1000ms per frame)
- **Scale Control**: Adjust zoom level from 1x to 8x magnification
- **Export Frame**: Save the current frame as a PNG image

### Understanding the Interface

- **Left Panel**: Animation preview with controls and frame selector
- **Right Panel**: Configuration options, character customization, and info
- **Frame Counter**: Shows current frame and total frames
- **Animation Info**: Displays technical details and descriptions

## LPC Format Information

### What is LPC?

The Liberated Pixel Cup (LPC) is an open-source pixel art format designed for game development. It features:

- **Modular Characters**: Separate layers for body parts, clothing, accessories
- **Standard Dimensions**: 64x64 pixel frames arranged in spritesheets
- **Multiple Animations**: Walk, run, combat, and utility animations
- **4-Directional**: Support for up, down, left, right facing directions
- **Open Licensing**: Creative Commons and GPL licensed artwork

### Animation Standards

This generator follows LPC animation standards:

- **Walk**: 9 frames - Standard walking cycle
- **Run**: 8 frames - Faster movement with more bounce
- **Jump**: 9 frames - Vertical leap sequence
- **Idle**: 6 frames - Breathing/standing animation
- **Sit**: 1 frame - Static sitting pose
- **Cast**: 7 frames - Spellcasting gesture
- **Slash**: 6 frames - Melee weapon attack
- **Thrust**: 8 frames - Stabbing weapon attack
- **Shoot**: 13 frames - Bow and arrow sequence
- **Hurt**: 6 frames - Damage reaction
- **Climb**: 3 frames - Ladder/wall climbing

### Frame Layout

LPC spritesheets use a standard layout:
- **Rows**: Represent directions (Up, Left, Down, Right)
- **Columns**: Represent animation frames
- **Size**: Each frame is 64x64 pixels
- **Spacing**: No padding between frames in standard format

## Development

### Adding New Animations

To add a new animation type:

1. **Update Constants**: Add to `ANIMATIONS` in `useAnimation.js`
```javascript
newAnimation: { frames: X, name: 'New Animation' }
```

2. **Add Frame Offsets**: Update `getFrameOffset` in `characterRenderer.js`
```javascript
newAnimation: [
  { x: 0, y: 0 }, // Frame offsets
  // ... more frames
]
```

3. **Add Description**: Update `AnimationInfo.js` with animation details

### Customizing Character Rendering

The character renderer (`characterRenderer.js`) uses HTML5 Canvas to draw simple placeholder sprites. To use actual LPC sprites:

1. **Load Sprite Images**: Replace `createCharacterSprite` function
2. **Implement Layering**: Stack multiple sprite layers (body, clothing, etc.)
3. **Handle Directions**: Use different sprite sections for each direction
4. **Add Color Variations**: Support different hair/clothing colors

### Styling and Themes

Styles are organized in `App.css` with CSS custom properties for easy theming:

- **Layout**: CSS Grid for responsive design
- **Components**: Modular component styles
- **Utilities**: Reusable utility classes
- **Colors**: Consistent color scheme throughout

### Building for Production

```
mkdir -p dist && \
docker build --build-arg NODE_ENV=production -t spritesheet-builder-image . && \
docker run --rm \
  -v "$(pwd)/dist:/output" \
  spritesheet-builder-image
```

### Development Build
```bash
npm run build
# or
yarn build
```

This creates a `build/` directory with optimized files ready for deployment.

#### Manual Docker Build

```bash
# Build the Docker image
docker build -t spritesheet-generator .

# Run the container
docker run -p 8080:80 spritesheet-generator

# Run in detached mode
docker run -d -p 8080:80 --name spritesheet-app spritesheet-generator
```

### Traditional Deployment Options

- **Static Hosting**: GitHub Pages, Netlify, Vercel
- **CDN**: Upload build files to any CDN
- **Web Server**: Serve from Apache, Nginx, or any web server

### Manual Nginx Setup

If deploying without Docker, use this Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Contributing

### Ways to Contribute

1. **Bug Reports**: Open issues for bugs or problems
2. **Feature Requests**: Suggest new animations or features
3. **Code Improvements**: Submit pull requests with enhancements
4. **Documentation**: Improve README or add code comments
5. **Testing**: Test on different browsers and devices

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## LPC Attribution and Licensing

### Important Legal Notice

This application is a **demonstration tool** that uses placeholder sprites. When using actual LPC sprites in your projects, you **must** provide proper attribution.

### Required Attribution

When using LPC sprites, you must:

1. **Credit All Artists**: List every contributor to the sprites you use
2. **Include License Information**: Specify CC-BY-SA, CC-BY, GPL, etc.
3. **Provide Links**: Link to original sources when possible
4. **Make Credits Accessible**: Include credits in your game/app interface

### License Types

LPC sprites use various open-source licenses:

- **CC0**: Public domain, no attribution required
- **CC-BY**: Attribution required
- **CC-BY-SA**: Attribution + share-alike required
- **OGA-BY**: OpenGameArt attribution license
- **GPL**: GNU General Public License

### Resources

- [Official LPC Repository](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator)
- [Complete Credits File](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/blob/master/CREDITS.csv)
- [LPC Project Homepage](https://lpc.opengameart.org)
- [Attribution Guidelines](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/blob/master/README.md#licensing-and-attribution-credits)

## Troubleshooting

### Common Issues

**Animation not playing smoothly**
- Try adjusting the speed slider
- Check if browser is throttling background tabs
- Ensure hardware acceleration is enabled

**Canvas appears blurry**
- This is normal for very small scales
- Increase scale for sharper pixels
- Browser zoom can affect rendering

**Controls not responding**
- Refresh the page
- Check browser console for errors
- Try a different browser

**Export not working**
- Ensure pop-ups are allowed
- Try right-clicking the canvas and "Save image as"
- Check browser download permissions

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Basic support (touch may vary)

### Performance Tips

- Use smaller scale values for better performance
- Close other browser tabs if animation stutters
- Clear browser cache if issues persist

## Technical Details

### Dependencies

- **React**: UI framework
- **Lucide React**: Icon library
- **HTML5 Canvas**: Graphics rendering
- **CSS Grid/Flexbox**: Layout system

### Browser Requirements

- Modern browser with ES6+ support
- HTML5 Canvas support
- JavaScript enabled
- Local storage access (for future features)

### File Formats

- **Export**: PNG images
- **Import**: Future feature for actual LPC spritesheets
- **Configuration**: JSON format for settings

## Future Enhancements

### Planned Features

- **Real LPC Sprite Loading**: Import actual LPC spritesheet files
- **Animation Export**: Export full animation sequences as GIF
- **Color Customization**: Change hair, clothing, skin colors
- **Custom Animations**: Define your own frame sequences
- **Batch Export**: Export all frames or multiple animations
- **Spritesheet Generation**: Create complete LPC-format spritesheets

### Advanced Features

- **Layer Management**: Control individual sprite layers
- **Animation Editor**: Modify timing and frame offsets
- **Character Builder**: Mix and match different LPC assets
- **Template System**: Save and load character configurations
- **Preview Grid**: Compare multiple animations side-by-side

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **LPC Contributors**: All artists who contributed to the Liberated Pixel Cup
- **OpenGameArt.org**: Platform hosting LPC artwork
- **React Team**: For the excellent framework
- **Open Source Community**: For tools and inspiration

## Support

For questions, issues, or suggestions:

1. **Check Existing Issues**: Look for similar problems
2. **Create New Issue**: Provide detailed description
3. **Community Discussion**: Join LPC forums and communities
4. **Documentation**: Refer to this README and code comments

---

**Happy Animating!** 🎮✨

*This tool is designed to help game developers work with LPC animations. Remember to properly attribute LPC artists when using their work in your projects.*
