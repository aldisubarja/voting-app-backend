# octomate-test-backend

A simple voting system backend built with Node.js, Express, MongoDB, and JWT authentication. Includes user registration, login, voting functionality, and admin access for results.

---

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/aldisubarja/octomate-test-backend.git
cd octomate-test-backend

### 2. Install dependencies
npm install

### 3. Setup env configuration
cp .example.env .env
cat > .env <<EOL
PORT=5000
JWT_SECRET=octomate-key-backend
MONGO_URI="mongodb+srv://aldisubarja:30u9vESJh9HXh8sU@cluster-free-aldi.nqqqfqx.mongodb.net/?retryWrites=true&w=majority&appName=cluster-free-aldi"
EOL

### 4. Run test
npm test

### 5. Run app
npm start 