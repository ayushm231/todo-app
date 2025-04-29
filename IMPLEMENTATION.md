# IMPLEMENTATION.md

## ✅ Tech Stack

### Frontend:

- React.js
- Tailwind CSS (for styling)
- Axios (API calls)

### Backend:

- Node.js with Express
- MongoDB with Mongoose

### Deployment:

- Frontend: Vercel
- Backend: Render

---

## 🚀 How to Run the App

### Prerequisites:

- Node.js and npm
- MongoDB (local or Atlas)

---

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```

- MongoDB runs on `mongodb://localhost:27017/todo-app`
- Server runs on `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

- App runs on `http://localhost:5173` (or whichever Vite port)

- `.env` file:

client:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

server:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo-app
```

---

## 💡 Design Decisions

- Mentions are handled using `@username` in tags input
- Validation of mentions occurs on both create and update
- `X-User-ID` header sent with every API call for user-specific operations
- Notes are stored as an array inside each todo
- Pagination is handled via `page` and `limit` query params

---

## ✅ Implemented Features

- Create, edit, delete todos
- Add priorities (High, Medium, Low)
- Mention users via tags (`@username`)
- Add notes to todos via modal
- Pagination
- User switcher (pre-created users)
- Validation of mentioned users
- Authentication for user-specific operations
- Error handling and validation

---

## ❌ Not Implemented

- Filtering by tags, users, or priority
- Sorting by creation date or priority
- Data export (JSON/CSV)
- Unit or integration tests

---

## 📂 Folder Structure

```
/client
  /components
  /services
  App.jsx
  main.jsx

/server
  /models
  /routes
  /controllers
  server.js
```

---

## 📝 Assumptions

- Only valid users should be tagged via `@username`
- Tags are a mix of keywords and user mentions
- All todos are user-specific; switching user filters them

---

## ✨ Improvements (if more time)

- Add filters and sorting
- Add CSV/JSON export
- Tests for APIs and components
- Debounced `@mention` suggestions
