# voting-app-backend

A simple voting system backend built with Node.js, Express, MongoDB, and JWT authentication. Includes user registration, login, voting functionality, and admin access for results.

---

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/aldisubarja/voting-app-backend.git
cd voting-app-backend

### 2. Install dependencies
npm install

### 3. Setup env configuration
cp .example.env .env
cat > .env <<EOL
PORT=5000
JWT_SECRET=voting-app-key-backend
MONGO_URI="YOUR_MONGO_URI"
EOL

### 4. Run test
npm test

### 5. Run app
npm start 
