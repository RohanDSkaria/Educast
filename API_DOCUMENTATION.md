# EduCast API Documentation

Base URL: `http://localhost:8080`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/signup

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student"  // or "Mentor"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "rating_avg": 0,
    "created_at": "2026-02-14T12:00:00Z"
  }
}
```

### POST /auth/login

Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "rating_avg": 0
  }
}
```

---

## Bounties

### POST /api/bounties

Create a new bounty (Student only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Help with Calculus Problem",
  "description": "I need help understanding derivatives and chain rule",
  "subject_tag": "Mathematics",
  "budget": 25.00
}
```

**Response (201):**
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Help with Calculus Problem",
  "description": "I need help understanding derivatives and chain rule",
  "subject_tag": "Mathematics",
  "budget": 25.00,
  "status": "OPEN",
  "created_at": "2026-02-14T12:00:00Z",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

### GET /api/bounties

List bounties (filtered by role).

**Headers:** `Authorization: Bearer <token>`

**Behavior:**
- Students: Returns only their own bounties
- Mentors: Returns all OPEN bounties

**Response (200):**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "title": "Help with Calculus Problem",
    "description": "I need help understanding derivatives",
    "subject_tag": "Mathematics",
    "budget": 25.00,
    "status": "OPEN",
    "created_at": "2026-02-14T12:00:00Z",
    "student": {
      "id": 1,
      "name": "John Doe"
    }
  }
]
```

### GET /api/bounties/:id

Get bounty details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "student_id": 1,
  "title": "Help with Calculus Problem",
  "description": "I need help understanding derivatives",
  "subject_tag": "Mathematics",
  "budget": 25.00,
  "status": "OPEN",
  "room_id": null,
  "created_at": "2026-02-14T12:00:00Z",
  "student": {
    "id": 1,
    "name": "John Doe"
  },
  "bids": [
    {
      "id": 1,
      "bounty_id": 1,
      "mentor_id": 2,
      "price_offer": 20.00,
      "note": "I can help you with this",
      "is_accepted": false,
      "mentor": {
        "id": 2,
        "name": "Jane Smith",
        "rating_avg": 4.5
      }
    }
  ]
}
```

### POST /api/bounties/:id/complete

Complete a bounty and rate mentor (Student only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5  // 1-5
}
```

**Response (200):**
```json
{
  "message": "Bounty completed successfully",
  "bounty": {
    "id": 1,
    "status": "CLOSED"
  }
}
```

---

## Bids

### POST /api/bounties/:id/bids

Place a bid on a bounty (Mentor only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "price_offer": 20.00,
  "note": "I have 5 years of experience teaching calculus"
}
```

**Response (201):**
```json
{
  "id": 1,
  "bounty_id": 1,
  "mentor_id": 2,
  "price_offer": 20.00,
  "note": "I have 5 years of experience teaching calculus",
  "is_accepted": false,
  "created_at": "2026-02-14T12:00:00Z",
  "mentor": {
    "id": 2,
    "name": "Jane Smith",
    "rating_avg": 4.5
  }
}
```

### GET /api/bounties/:id/bids

Get all bids for a bounty (Student only, must own bounty).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": 1,
    "bounty_id": 1,
    "mentor_id": 2,
    "price_offer": 20.00,
    "note": "I can help",
    "is_accepted": false,
    "created_at": "2026-02-14T12:00:00Z",
    "mentor": {
      "id": 2,
      "name": "Jane Smith",
      "rating_avg": 4.5
    }
  }
]
```

### POST /api/bids/:id/accept

Accept a bid (Student only).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Bid accepted successfully",
  "room_id": "550e8400-e29b-41d4-a716-446655440000",
  "bid": {
    "id": 1,
    "is_accepted": true
  },
  "mentor_id": 2
}
```

**Side Effects:**
- Bounty status changes to IN_PROGRESS
- Bid is marked as accepted
- ESCROW transaction is created
- Room ID is generated
- WebSocket notification sent to mentor

---

## WebSocket

### GET /ws?token=<JWT>

Establish WebSocket connection.

**Query Parameters:**
- `token`: JWT authentication token

**Events Received:**

#### bounty_created
Sent to all mentors when a new bounty is posted.

```json
{
  "type": "bounty_created",
  "payload": {
    "id": 1,
    "title": "Help with Calculus",
    "description": "...",
    "budget": 25.00,
    "student": {
      "name": "John Doe"
    }
  }
}
```

#### bid_created
Sent to the student who owns the bounty when a mentor places a bid.

```json
{
  "type": "bid_created",
  "payload": {
    "id": 1,
    "bounty_id": 1,
    "mentor_id": 2,
    "price_offer": 20.00,
    "note": "I can help",
    "mentor": {
      "name": "Jane Smith",
      "rating_avg": 4.5
    }
  }
}
```

#### bid_accepted
Sent to the mentor whose bid was accepted.

```json
{
  "type": "bid_accepted",
  "payload": {
    "bid_id": 1,
    "bounty_id": 1,
    "room_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Not implemented in prototype. Should be added for production.

## CORS

Currently allows all origins for development. Restrict in production.
