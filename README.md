# Focus Flow

This project is a Chrome extension for tracking time spent on websites and generating daily reports.

## Features

- Track time spent on websites daily.
- View detailed reports and charts of time spent.
- User authentication with login, signup, and logout.
- Dashboard visible only after login.
- Backend built with MERN stack (MongoDB, Express, React, Node.js).
- JWT-based authentication.

## Setup and Run

### Backend

1. Install dependencies:

```bash
npm install express mongoose cors dotenv bcrypt jsonwebtoken
```

2. Create a `.env` file with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

3. Start the server:

```bash
node server.js
```

or with nodemon:

```bash
nodemon server.js
```

### Frontend

- Load the extension in Chrome via `chrome://extensions` > Load unpacked > select the project directory.

## Images

### image1.jpg

![Screenshot](./image1.png)

### image2.png

![Screenshot](./image2.png)
