# Custom Fields Management System

A full-stack TypeScript application for managing dynamic custom fields in projects.

## 🚀 Features

- **Dynamic Field Creation** - Create custom fields of different types (text, number, date, select)
- **Field Management** - Edit, delete, and reorder custom fields
- **Value Management** - Fill in and edit field values for projects
- **Real-time Updates** - Automatic refresh when fields are modified
- **Type Safety** - Full TypeScript implementation on both frontend and backend
- **Responsive Design** - Works on desktop and mobile devices

## 🏗️ Tech Stack

### Frontend
- **React** 18 with TypeScript
- **CSS Modules** - Scoped styling for each component
- **Axios** - HTTP client for API calls
- **Custom Hooks** - Reusable logic (useAlert)

### Backend
- **Node.js** with Express
- **TypeORM** - Database ORM
- **PostgreSQL/MySQL** - Relational database
- **TypeScript** - Type-safe backend


## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL or MySQL database

### Backend Setup

```bash
cd backend
npm install

# Create .env file with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

cd src
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Create .env file with API URL
# REACT_APP_API_URL=http://localhost:3001/api

npm start
```

