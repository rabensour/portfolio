# Installation Guide

## Load Extension in Chrome

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle switch in top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to: `C:\Users\Admin\Desktop\Claude\projects\airbnb-data-extractor\`
   - Select the folder (or click inside and press "Select Folder")

4. **Verify Extension Loaded**
   - You should see "Airbnb Listing Extractor" card
   - No errors in red text
   - Extension icon appears in toolbar

## Test the Extension

1. **Navigate to Airbnb listing**
   ```
   https://www.airbnb.com/rooms/12345
   ```
   (Use any real listing URL)

2. **Click extension icon** in Chrome toolbar
   - Sidebar should open on the right (400px width)

3. **Click "Extract All" button**
   - Check browser console (F12) for logs
   - Sidebar sections should populate with data

## Troubleshooting

### "Could not load icon" error
✅ **FIXED** - Icons now created

### Extension not appearing
- Make sure you selected the correct folder
- Check for red error text in chrome://extensions
- Try clicking "Reload" button under extension card

### Sidebar not opening
- Make sure you're on an Airbnb listing page (`/rooms/*`)
- Right-click extension icon → "Open side panel"

### No data extracted
- Open DevTools Console (F12)
- Check for error messages
- Airbnb structure may have changed (JSON paths need adjustment)

## Dev Console Logs to Expect

```
[Background] Service worker loaded
[Content Script] Loaded on: https://www.airbnb.com/rooms/12345
[Content Script] Ready for extraction
[Sidebar] Loaded
[Sidebar] Extract button clicked
[Background] Message received: REQUEST_EXTRACTION
[Content Script] Message received: REQUEST_EXTRACTION
[Content Script] Starting extraction...
[JSON Extractor] Starting JSON extraction
[Content Script] Extraction complete
[Sidebar] Received response
[Sidebar] Displaying data
```

## Next Steps After Loading

1. Test extraction on real listing
2. Check which sections extract successfully
3. Note any errors in console
4. Adjust JSON paths if needed (in `content/extractors/json-extractor.js`)
5. Continue with Phase 3 (Calendar extraction)

## Current Implementation Status

✅ Phase 1: Infrastructure (100%)
✅ Phase 2: Data Extraction (100%)
⏳ Phase 3: Calendar (0%)
⏳ Phase 4: Photos ZIP (0%)
⏳ Phase 5: UI Polish (0%)
⏳ Phase 6: Testing (0%)

## Known Limitations

- Placeholder icons (gray squares) - functional but not branded
- Calendar extraction not implemented yet
- Photo ZIP download not implemented yet
- Some Airbnb page variations may not extract perfectly (needs testing)
