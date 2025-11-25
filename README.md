# 🎯 Internship Tracker

A beautiful web application to track your internship applications. Keep track of company names, roles, application dates, and current status all in one place.

**Data is stored locally in your browser** - each device/browser has its own separate data. No login required!

## Features

- ✅ Add, edit, and delete internship applications
- 📊 Track company name, role/posting, date applied, and status
- 🔍 Filter applications by status (Applied, Interview, Offer, Rejected, Withdrawn)
- 💾 Persistent data storage (browser localStorage)
- 🎨 Modern, minimal UI with cream/beige color scheme
- ⚡ Fast and lightweight
- 🌐 Works offline - no backend required!

## Tech Stack

- **Frontend**: React + Vite
- **Storage**: Browser localStorage (no backend needed)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

### Running Locally

Start the development server:
```bash
cd frontend
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`.

### Building for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` ready for deployment.

## Deployment to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Deploy!

The app is configured to work as a static site on Netlify with no backend required.

## Usage

1. **Add an Internship**: Click the "Add Internship" button and fill in:
   - Company Name
   - Role/Posting
   - Date Applied
   - Status (Applied, Interview, Offer, Rejected, or Withdrawn)

2. **Edit an Internship**: Click the "Edit" button on any internship card to modify its details.

3. **Delete an Internship**: Click the "Delete" button on any internship card (with confirmation).

4. **Filter Applications**: Use the filter buttons at the top to view internships by status.

## Data Storage

- All data is stored in your browser's localStorage
- Each browser/device has its own separate data
- Data persists even after closing the browser
- To clear data, clear your browser's localStorage

## Project Structure

```
internship-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/          # Storage service
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── netlify.toml               # Netlify deployment config
└── README.md
```

## Future Enhancements

- Add search functionality
- Export data to CSV/PDF
- Add notes/description field
- Add interview date tracking
- Import/export data functionality
- Dark mode

## License

MIT
