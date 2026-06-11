# Student Management REST API

A beginner-friendly REST API for managing students. It uses Node.js, Express.js, MongoDB, Mongoose, JWT authentication, bcryptjs password hashing, dotenv, and cors.

## Features

- Register, login, and profile endpoints
- JWT protected routes with `Authorization: Bearer <token>`
- Role-based access control for admin, teacher, and student users
- Student CRUD endpoints
- Filtering by course and status
- Searching by first name, last name, email, and course
- Sorting by fields such as score
- Centralized JSON error handling

## Project Structure

```text
src/
  config/
    db.js
  controllers/
    authController.js
    studentController.js
  middleware/
    authMiddleware.js
    roleMiddleware.js
    errorMiddleware.js
  models/
    User.js
    Student.js
  routes/
    authRoutes.js
    studentRoutes.js
  utils/
    generateToken.js
  app.js
  server.js
```

## Installation

```bash
npm install
```

Create a `.env` file in the project root. You can copy `.env.example` and update the values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_management_api
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Make sure MongoDB is running locally, then start the server:

```bash
npm run dev
```

For production-style startup:

```bash
npm start
```

Base URL:

```text
http://localhost:5000
```

## Response Format

Success response:

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Authentication Flow

1. Register a user with `POST /api/auth/register`.
2. Login with `POST /api/auth/login`.
3. Copy the returned token.
4. Send the token on protected routes:

```http
Authorization: Bearer your_jwt_token
```

## Role Permissions

| Action | Admin | Teacher | Student |
| --- | --- | --- | --- |
| Read students | Yes | Yes | Yes |
| Create students | Yes | No | No |
| Update students | Yes | Yes | No |
| Delete students | Yes | No | No |

## Auth Endpoints

### Register

`POST /api/auth/register`

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

Successful response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "JWT_TOKEN"
  }
}
```

Notes:

- `role` can be `admin`, `teacher`, or `student`.
- If `role` is not provided, it defaults to `teacher`.
- Password must be at least 6 characters.

### Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "JWT_TOKEN"
  }
}
```

### Profile

`GET /api/auth/profile`

Headers:

```http
Authorization: Bearer JWT_TOKEN
```

Successful response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "_id": "USER_ID",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

## Student Endpoints

All student endpoints require a Bearer token.

### Get All Students

`GET /api/students`

Example:

```http
GET /api/students
Authorization: Bearer JWT_TOKEN
```

Query examples:

```text
/api/students?course=JavaScript
/api/students?status=active
/api/students?search=john
/api/students?sort=score
/api/students?sort=-score
```

Successful response:

```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": [
    {
      "_id": "STUDENT_ID",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "course": "JavaScript",
      "age": 20,
      "score": 85,
      "status": "active"
    }
  ]
}
```

### Get One Student

`GET /api/students/:id`

Successful response:

```json
{
  "success": true,
  "message": "Student fetched successfully",
  "data": {
    "_id": "STUDENT_ID",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "course": "JavaScript",
    "age": 20,
    "score": 85,
    "status": "active"
  }
}
```

### Create Student

`POST /api/students`

Admin only.

Request body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "course": "JavaScript",
  "age": 20,
  "score": 85,
  "status": "active"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "STUDENT_ID",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "course": "JavaScript",
    "age": 20,
    "score": 85,
    "status": "active"
  }
}
```

### Update Student

`PUT /api/students/:id`

Admin and teacher only.

Request body:

```json
{
  "course": "Node.js",
  "score": 92,
  "status": "active"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "STUDENT_ID",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "course": "Node.js",
    "age": 20,
    "score": 92,
    "status": "active"
  }
}
```

### Delete Student

`DELETE /api/students/:id`

Admin only.

Successful response:

```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "_id": "STUDENT_ID",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "course": "Node.js",
    "age": 20,
    "score": 92,
    "status": "active"
  }
}
```

## Validation Rules

User validation:

- `name` is required.
- `email` is required, unique, lowercase, and must be valid.
- `password` is required and must be at least 6 characters.
- `role` must be `admin`, `teacher`, or `student`.

Student validation:

- `firstName`, `lastName`, `email`, `course`, and `age` are required.
- `email` is unique, lowercase, and must be valid.
- `score` must be between 0 and 100.
- `status` must be `active` or `inactive`.
- Invalid MongoDB ObjectIds return a clear error.

## Postman or Thunder Client Testing Guide

1. Start MongoDB locally.
2. Run `npm run dev`.
3. Create an admin user with `POST /api/auth/register`.
4. Copy `data.token` from the response.
5. In Postman or Thunder Client, open the Authorization tab.
6. Choose Bearer Token and paste the token.
7. Create a student with `POST /api/students`.
8. Test read routes as admin, teacher, and student users.
9. Confirm permissions:
   - Admin can create, read, update, and delete.
   - Teacher can read and update.
   - Student can only read.
10. Test validation by sending an invalid email, duplicate email, invalid role, invalid status, and scores such as `-1` or `101`.

## Example cURL Requests

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"password123\",\"role\":\"admin\"}"
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

Create student:

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"course\":\"JavaScript\",\"age\":20,\"score\":85,\"status\":\"active\"}"
```

Get students sorted by highest score:

```bash
curl "http://localhost:5000/api/students?sort=-score" \
  -H "Authorization: Bearer JWT_TOKEN"
```
