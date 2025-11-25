# Extension Setup & Testing Guide

## Step 1: Create Icon Files (Required)

The extension needs icon files. You have a few options:

### Option A: Use Simple Colored Squares (Quickest)
1. Create three simple colored square images:
   - `icon16.png` - 16x16 pixels
   - `icon48.png` - 48x48 pixels  
   - `icon128.png` - 128x128 pixels

You can use any image editor (Paint, GIMP, online tools) to create simple squares with a color like #3d3a35 (dark brown) or #3b82f6 (blue).

### Option B: Use Online Icon Generator
1. Go to https://www.favicon-generator.org/ or similar
2. Upload any image or create a simple design
3. Download the 16x16, 48x48, and 128x128 sizes
4. Rename and place them in the `browser-extension` folder

### Option C: Use the Python Script (if you have Python)
Run the `create-icons.py` script in this folder to auto-generate simple icons.

## Step 2: Start Your Backend Server

Make sure your backend is running:

```bash
# From the project root
npm run dev:backend

# Or
cd backend
npm start
```

The server should be running on `http://localhost:3001`

## Step 3: Load the Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in the top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to and select the `browser-extension` folder in your project
6. The extension should appear in your extensions list

## Step 4: Pin the Extension (Optional but Recommended)

1. Click the puzzle piece icon (extensions) in Chrome toolbar
2. Find "Internship Tracker" in the list
3. Click the pin icon to pin it to your toolbar for easy access

## Step 5: Test the Extension

### Test 1: Basic Functionality
1. Open any webpage (doesn't have to be a job posting)
2. Click the extension icon in your toolbar
3. The popup should open with the form
4. Fill in:
   - Company: "Test Company"
   - Role: "Test Role"
   - Date Applied: (should default to today)
   - Status: "Applied"
5. Click "Add to Tracker"
6. You should see a success message
7. Open `http://localhost:3000` and verify the internship was added

### Test 2: Auto-Fill from Job Posting
1. Visit a job posting on LinkedIn, Indeed, or Glassdoor
2. Click the extension icon
3. Check if Company and Role fields are auto-filled
4. If not, that's okay - different sites have different structures
5. Fill in manually and submit

### Test 3: Error Handling
1. Stop your backend server (`Ctrl+C`)
2. Click the extension icon and try to add an internship
3. You should see an error message: "Cannot connect to tracker..."

## Troubleshooting

### Extension won't load
- Make sure you selected the `browser-extension` folder (not a parent folder)
- Check that all required files are present (manifest.json, popup.html, etc.)
- Look for errors in the extensions page

### "Cannot connect to tracker" error
- Make sure backend is running on `http://localhost:3001`
- Check backend terminal for any errors
- Try accessing `http://localhost:3001/api/internships` in your browser

### Auto-fill not working
- This is normal - different job sites have different HTML structures
- The extension tries to detect common patterns but may not work on all sites
- You can always fill in manually

### Icons showing as broken/default
- Make sure icon files (icon16.png, icon48.png, icon128.png) exist in the browser-extension folder
- Reload the extension after adding icons

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup opens when clicking icon
- [ ] Form fields are visible and functional
- [ ] Can successfully add an internship
- [ ] Internship appears in main tracker app
- [ ] Error message shows when backend is down
- [ ] "Open Tracker" link works

