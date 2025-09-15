# Collaborative-Edge

**Collaborative-Edge** is a full-stack application featuring a **React-based frontend** and a **Node.js/Express backend**, connected to a **MongoDB database**. The project is designed to facilitate concurrent development and execution of both the frontend and backend, making it ideal for collaborative projects.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Running the Project](#running-the-project)
5. [Frontend Overview](#frontend-overview)
6. [Backend Overview](#backend-overview)
7. [Contributing](#contributing)
8. [License](#license)

---

## Project Structure

```
Collaborative_Edge/
├── frontend/                # React frontend (Vite)
│   ├── node_modules/        # Frontend dependencies (not pushed to Git)
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   ├── .env                 # Frontend environment variables (not pushed to Git)
│   ├── package.json         # Frontend dependencies and scripts
│   └── ...                  # Other frontend files
├── backend/                 # Node.js/Express backend
│   ├── node_modules/        # Backend dependencies (not pushed to Git)
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── .env                 # Backend environment variables (not pushed to Git)
│   ├── index.js             # Backend entry point
│   ├── package.json         # Backend dependencies and scripts
│   └── ...                  # Other backend files
├── node_modules/            # Node.js dependencies (not pushed to Git)
├── package.json             # Root package.json for concurrent execution
└── README.md                # Project documentation
```

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (running locally or a connection string to a remote instance)

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Umair-Habibx123/FYP_CE.git
   cd FYP_CE
   ```

2. **Install root dependencies:**

   ```bash
   npm install -g concurrently
   npm install --save-dev concurrently
   ```

3. **Install frontend dependencies:**

   ```bash
   cd frontend
   npm install
   ```

4. **Install backend dependencies:**

   ```bash
   cd ../backend
   npm install
   ```

5. **Set up environment variables:**

   - **Frontend**: Create a `.env` file in the `frontend` directory and add necessary variables (e.g., API endpoints).
   - **Backend**: Create a `.env` file in the `backend` directory and add your MongoDB connection string and other required variables.

---

## Running the Project

From the root directory, run:

```bash
npm run start
```

This command will concurrently start:

- The **frontend** development server (using Vite).
- The **backend** server (using `nodemon` for hot-reloading).

---

## Frontend Overview

The frontend is built using **React** with **Vite** for fast development. It includes:

- `public/`: Static assets like images and HTML files.
- `src/`: React components, styles, and application logic.
- `.env`: Environment variables for the frontend.

### Running the Frontend Separately

```bash
cd frontend
npm run dev
```

---

## Backend Overview

The backend is built using **Node.js** and **Express**, with **MongoDB** as the database. It includes:

- `models/`: MongoDB schemas and models.
- `routes/`: API routes and controllers.
- `.env`: Environment variables for the backend.

### Running the Backend Separately

```bash
cd backend
nodemon index.js
```

---

## Database Setup

This project uses MongoDB (Atlas). Follow these steps:

- Create a free cluster at MongoDB Atlas
- Whitelist your IP address.
- Create a database user and password.
- Copy the connection string into your .env:      MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/collaborativeEdge
- Models are automatically created in MongoDB when used in the backend code (no SQL migrations needed).
- If seed data is required, contact me.


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push your branch and open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

**Developed by [Umair Habib](https://github.com/Umair-Habibx123).**