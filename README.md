# IPL Dashboard

A modern web application to track IPL matches, team standings, and player statistics. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📅 Match Schedule with live scores
- 🏆 Points Table
- 🎨 Modern UI with team colors
- 📱 Responsive design
- 🔄 Real-time data updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd src/server
npm install
cd ../..
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Frontend environment variables
VITE_API_URL=http://localhost:3001

# Backend environment variables
CRICKET_API_KEY=4cfb4240-7d2c-468a-b75d-3f7a83592052
```

### 4. Start the Development Server

#### Start the Backend Server

First, ensure no other process is using port 3001:

```bash
# On macOS/Linux
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

Then start the backend server:

```CRICKET_API_KEY=4cfb4240-7d2c-468a-b75d-3f7a83592052 node src/server/server.js```

The backend server will start on http://localhost:3001

#### Start the Frontend Development Server

```bash
# From the project root
npm run dev
```

The frontend application will start on http://localhost:5173

## Project Structure

```
PROJECT/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── server/        # Backend server
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── index.html         # HTML entry point
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## API Endpoints

The backend server provides the following endpoints:

- `GET /api/matches` - Get all matches
- `GET /api/points-table` - Get points table
- `GET /api/schedules` - Get match schedules
- `GET /api/health` - Health check endpoint

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check
```

### Code Style

The project uses ESLint and Prettier for code formatting. To format your code:

```bash
npm run format
```

## Troubleshooting

### Common Issues

1. **Port Already in Use (EADDRINUSE)**
   - If you see "address already in use :::3001" error:
     ```bash
     # On macOS/Linux
     lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
     
     # On Windows
     netstat -ano | findstr :3001
     taskkill /PID <PID> /F
     ```
   - Then restart the server

2. **API Key Issues**
   - Ensure your CricAPI key is valid
   - Check if you've exceeded the API rate limit
   - Verify the API key is correctly set in the environment variables

3. **Server Connection Issues**
   - Make sure the backend server is running on port 3001
   - Check if the `VITE_API_URL` environment variable is correctly set
   - Verify there are no CORS issues

4. **Build Issues**
   - Clear the `node_modules` folder and reinstall dependencies
   - Ensure all TypeScript types are properly defined
   - Check for any missing dependencies

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CricAPI](https://cricapi.com/) for providing the cricket data
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for type safety 