# Internship Tracker Browser Extension

A Chrome extension that allows you to quickly add internship applications to your tracker from any webpage.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder from this project
5. The extension icon should appear in your toolbar

## Usage

1. **Quick Add**: Click the extension icon in your toolbar to open the popup
2. **Auto-fill**: If you're on a job posting page, the extension will try to auto-fill the company and role fields
3. **Manual Entry**: Fill in the form manually if auto-fill doesn't work
4. **Submit**: Click "Add to Tracker" to save the internship

## Requirements

- The backend server must be running on `http://localhost:3001`
- The frontend should be accessible at `http://localhost:3000`

## Features

- Quick-add popup from any webpage
- Auto-detection of company and role from job posting pages
- Automatic date setting (today's date)
- Direct link to open the full tracker
- Minimal design matching the main app

## Troubleshooting

If you see "Cannot connect to tracker" error:
- Make sure the backend server is running: `npm run dev:backend` or `cd backend && npm start`
- Check that the server is running on port 3001

## Supported Job Sites

The extension tries to auto-detect job information from:
- LinkedIn
- Indeed
- Glassdoor
- Generic job posting pages

If auto-detection doesn't work, you can always fill in the form manually.

