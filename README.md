<div align="center">

# 🏢 MeetRoom — Meeting Room Booking System

A sleek, full-stack meeting room booking system built with **Spring Boot** and a modern **dark-themed UI**. Book rooms, view reservations, cancel bookings — with conflict detection and smart slot suggestions.

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## ✨ Features

- 🗓️ **Book Meeting Rooms** — Select a room (A, B, or C), pick a time range, and reserve instantly
- 👁️ **View Bookings** — Browse all scheduled meetings per room with detailed time info
- 🗑️ **Cancel Bookings** — Delete reservations with a confirmation modal
- ⚡ **Conflict Detection** — Automatically detects overlapping bookings and suggests the next available slot
- 🔌 **Swagger API Docs** — Built-in OpenAPI documentation at `/docs`
- 📱 **Responsive Design** — Works beautifully on desktop and mobile
- 🌙 **Premium Dark Theme** — Glassmorphism, micro-animations, and floating particles

---

## 📸 Screenshots

<div align="center">

### Book a Room
<img src="screenshots/booking-page.png" alt="Booking Page" width="700"/>

### Booking Confirmed
<img src="screenshots/booking-confirmed.png" alt="Booking Confirmed Toast" width="700"/>

### View Bookings
<img src="screenshots/view-bookings.png" alt="View Bookings" width="700"/>

### Cancel Booking Modal
<img src="screenshots/delete-modal.png" alt="Delete Confirmation Modal" width="700"/>

### Empty State
<img src="screenshots/empty-state.png" alt="No Bookings Empty State" width="700"/>

</div>

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────┐
│                  Frontend                       │
│         (HTML + CSS + Vanilla JS)               │
│    Served from Spring Boot static resources     │
└────────────────┬───────────────────────────────┘
                 │  REST API (JSON)
┌────────────────▼───────────────────────────────┐
│              Spring Boot Backend                │
│                                                 │
│  ┌─────────────┐  ┌──────────────┐             │
│  │  Controller  │→│   Service    │             │
│  │  /api/*      │  │  (Business   │             │
│  │              │  │   Logic)     │             │
│  └─────────────┘  └──────┬───────┘             │
│                          │                      │
│                 ┌────────▼────────┐             │
│                 │  In-Memory Map  │             │
│                 │  (Room → List)  │             │
│                 └─────────────────┘             │
└─────────────────────────────────────────────────┘
```

---

## 🔌 API Reference

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/book` | Create a booking | `BookingRequest` |
| `GET` | `/api/bookings/{roomId}` | Get all bookings for a room | — |
| `DELETE` | `/api/booking/{id}` | Cancel a booking by ID | — |

### Request: `BookingRequest`
```json
{
  "roomId": "A",
  "startTime": "2026-03-25T10:00:00",
  "endTime": "2026-03-25T11:00:00"
}
```

### Response: `BookingResponse`

**Success:**
```json
{
  "status": "success",
  "message": "Booking successful"
}
```

**Conflict (with suggested slot):**
```json
{
  "status": "conflict",
  "message": "Slot not available",
  "suggestedStart": "2026-03-25T11:00:00",
  "suggestedEnd": "2026-03-25T12:00:00"
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Invalid room"
}
```

### Response: `Booking` (from GET endpoint)
```json
[
  {
    "id": "a1b2c3d4-...",
    "roomId": "A",
    "startTime": "2026-03-25T10:00:00",
    "endTime": "2026-03-25T11:00:00"
  }
]
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21+**
- **Maven 3.9+** (included via Maven Wrapper)

### Run Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/meetingRoom.git
cd meetingRoom

# Start the application
./mvnw spring-boot:run
```

The app will be live at **http://localhost:8080**

📄 Swagger API docs available at **http://localhost:8080/docs**

### Run with Docker

```bash
# Build the image
docker build -t meetroom .

# Run the container
docker run -p 8080:8080 meetroom
```

---

## 🌐 Deployment

### Deploy to Render (Free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Runtime:** Docker
   - **Branch:** main
   - **Instance Type:** Free
5. Click **Deploy**

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login & deploy
railway login
railway init
railway up
```

---

## 📁 Project Structure

```
meetingRoom/
├── src/main/java/com/example/meetingRoom/
│   ├── MeetingRoomApplication.java        # Entry point
│   ├── controller/
│   │   └── BookingController.java         # REST endpoints
│   ├── service/
│   │   └── BookingService.java            # Business logic & conflict detection
│   ├── model/
│   │   ├── Booking.java                   # Booking entity
│   │   ├── BookingRequest.java            # Request DTO
│   │   └── BookingResponse.java           # Response DTO
│   └── exceptions/
│       ├── BadRequestException.java       # Custom exception
│       └── GlobalExceptionHandler.java    # Centralized error handling
├── src/main/resources/
│   ├── static/                            # Frontend (HTML/CSS/JS)
│   └── application.properties
├── frontend/                              # Frontend source (dev)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── screenshots/                           # UI screenshots
├── Dockerfile                             # Multi-stage Docker build
├── pom.xml
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 4.0, Java 21 |
| **Frontend** | Vanilla HTML/CSS/JS |
| **API Docs** | Swagger / SpringDoc OpenAPI |
| **Deployment** | Docker, Render / Railway |
| **Data Storage** | In-memory (HashMap) |

---

## 📌 Rooms Available

| Room ID | Name | Type |
|---------|------|------|
| `A` | Room A | Conference |
| `B` | Room B | Boardroom |
| `C` | Room C | Huddle |

> 💡 **Adding more rooms?** Simply add new entries in `BookingService.java` constructor:
> ```java
> roomBookings.put("D", new ArrayList<>());
> ```

---

## 📋 Future Improvements

- [ ] Persistent database (PostgreSQL / H2)
- [ ] User authentication
- [ ] Recurring meeting support
- [ ] Calendar view (weekly/monthly)
- [ ] Email notifications
- [ ] Room capacity & amenities info

---

<div align="center">

Made with ☕ and Spring Boot

</div>
