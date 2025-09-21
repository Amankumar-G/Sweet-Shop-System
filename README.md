# 🍬 Sweet Delights

## Live demo

You can try the deployed demo here:

- URL: https://sweets.amanverse.dev/

Admin demo credentials (use for testing only):

- Email: `admin@sweets.com`
- Password: `admin123!`

Note: These demo credentials are publicly visible in this repository for convenience of testing only.

## Installation Guide

### 1. Repository Setup

```bash
git clone https://github.com/Amankumar-G/Sweet-Shop-System
cd Sweet-Shop-System
```

### 2. Backend Configuration

```bash
cd server
npm install
```

### 3. Frontend Configuration

```bash
cd client
npm install
```

### 4. Database Setup (Dockerized MongoDB + Backend)

Ensure Docker is installed, then run:

```bash
docker-compose up -d
```

---

## Development Environment

### Backend Server

```bash
cd server
npm start
```

*Server available at: [http://localhost:5000](http://localhost:5000)*

### Frontend Development Server

```bash
cd client
npm run dev
```

*Application available at: [http://localhost:5173](http://localhost:5173)*

![Home Page](/public/Home.png)
![Customer View Page](/public/Sweet.png)
![Admin View Page](/public/admin.png)
![Add New Sweet Page](/public/addSweet.png)

---

## Quality Assurance

#### 🧱 Testing Layers

* **Service Layer Testing (Kata)**: Pure logic validation, no external dependencies.
* **API Testing**: Validates HTTP requests/responses, full API + DB tests using a test database.

---

## Running Tests

### Backend Test Suite

```bash
cd server
npm test
```

### Frontend Code Quality

```bash
cd client
npm run lint
```

### Test Results & Coverage

After running tests, view the comprehensive analysis:

**[View Detailed Test Report](./TestReport.md)**

**Test Summary:**

* 132 Tests Passed (100% success rate)
* 91.96% Code Coverage
* 44.219s Execution Time
* 19 Test Suites (API + Unit tests)

---

## 🏗️ Architecture Overview

* **Frontend (React + Vite + ShadCN)**: Modern React application with component-based architecture.
* **Backend (Node.js + Express)**: RESTful API with layered architecture.
* **Database (MongoDB)**: Document-based storage for sweet inventory.
* **Testing (Jest)**: Comprehensive test suite with API and unit tests.
* **Containerization (Docker)**: Simplified deployment and development setup.
* **Hosting (AWS)**: Deployed version of the Sweet Delights.

---

## API Documentation

### 🔑 Auth Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login and get JWT   |

---

### 🍭 Sweet Management Endpoints

| Method | Endpoint                   | Auth Required | Admin Only | Description               |
| ------ | -------------------------- | ------------- | ---------- | ------------------------- |
| GET    | `/api/sweets/`             | ✅             | ❌          | Get all sweets            |
| GET    | `/api/sweets/search`       | ✅             | ❌          | Search/filter/sort sweets |
| POST   | `/api/sweets/`             | ✅             | ✅          | Add a new sweet           |
| PUT    | `/api/sweets/:id`          | ✅             | ✅          | Update sweet details      |
| DELETE | `/api/sweets/:id`          | ✅             | ✅          | Delete a sweet            |
| PUT    | `/api/sweets/:id/restock`  | ✅             | ✅          | Restock a sweet           |
| POST   | `/api/sweets/:id/purchase` | ✅             | ❌          | Purchase a sweet          |

---
## AI Tools Used

- **ChatGPT** – Assisted in backend logic, test case creation, and API error handling.  
- **Claude** – Helped identify edge cases for registration and brainstorming test scenarios.  
- **Gemini** – Guided JWT authentication testing and ideation for secure API design.  
- **DeepSeek** – Assisted in frontend wireframes, layout design, and theme ideation.
