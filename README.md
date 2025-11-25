# 🎯 Internship Tracker

A beautiful web application to track your internship applications. Keep track of company names, roles, application dates, and current status all in one place.

## Features

- ✅ Add, edit, and delete internship applications
- 📊 Track company name, role/posting, date applied, and status
- 🔍 Filter applications by status (Applied, Interview, Offer, Rejected, Withdrawn)
- 📈 Sankey diagram visualization of application flow
- 💾 Persistent data storage
- 🎨 Modern, minimal UI with cream/beige color scheme
- ⚡ Fast and lightweight

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Storage**: JSON file (easily upgradeable to database)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install all dependencies (root, backend, and frontend):
```bash
npm run install:all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Running the Application

Start both frontend and backend servers simultaneously:
```bash
npm run dev
```

Or run them separately:

**Backend** (runs on http://localhost:3001):
```bash
npm run dev:backend
```

**Frontend** (runs on http://localhost:3000):
```bash
npm run dev:frontend
```

The application will automatically open in your browser at `http://localhost:3000`.

## Usage

1. **Add an Internship**: Click the "+ Add New Internship" button and fill in:
   - Company Name
   - Role/Posting
   - Date Applied
   - Status (Applied, Interview, Offer, Rejected, or Withdrawn)

2. **Edit an Internship**: Click the "Edit" button on any internship card to modify its details.

3. **Delete an Internship**: Click the "Delete" button on any internship card (with confirmation).

4. **Filter Applications**: Use the filter buttons at the top to view internships by status.

5. **View Visualization**: Click "View Visualization" to see a Sankey diagram of your application flow.

## Project Structure

```
internship-tracker/
├── backend/
│   ├── data/
│   │   └── internships.json    # Data storage
│   └── server.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get single internship
- `POST /api/internships` - Create new internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship

## Future Enhancements

- Add search functionality
- Export data to CSV/PDF
- Add notes/description field
- Add interview date tracking
- Add reminders/notifications
- Database integration (MongoDB, PostgreSQL, etc.)
- User authentication
- Multiple user support

## License

MIT

