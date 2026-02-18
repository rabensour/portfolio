# Icons Needed

This folder requires 3 PNG icon files:

- **icon16.png** (16x16 pixels) - Toolbar icon
- **icon48.png** (48x48 pixels) - Extension management page
- **icon128.png** (128x128 pixels) - Chrome Web Store

## Quick Creation

### Option 1: Online Generator
Use https://www.favicon-generator.org/
1. Upload any image or create simple design
2. Download as PNG
3. Resize to 16px, 48px, and 128px

### Option 2: Simple Text Icon
Create simple icon with "AB" letters on colored background:
- Background: #FF5A5F (Airbnb pink)
- Text: White "AB"
- Font: Bold, centered

### Option 3: House Icon
Use any simple house emoji or icon:
- 🏠 or 🏡 converted to PNG
- Colored background

### Option 4: Use Existing Tool
```bash
# If you have ImageMagick installed:
convert -size 128x128 xc:#FF5A5F -pointsize 72 -fill white -gravity center -annotate +0+0 "AB" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

## Temporary Workaround

For testing only, you can use any existing PNG images temporarily. Just rename them to:
- icon16.png
- icon48.png
- icon128.png

The extension will work with any images, but proper icons are needed for production.
