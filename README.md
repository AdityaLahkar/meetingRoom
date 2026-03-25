# MeetRoom

A meeting room booking system built with Spring Boot. Supports booking rooms, viewing existing reservations, cancelling bookings, and handles time slot conflicts with automatic next-slot suggestions.

**Live:** https://meetingroom-1-n02f.onrender.com

> Free tier on Render — may take ~30s to wake up on first request.

## Tech Stack

- **Backend:** Java 21, Spring Boot 4.0
- **Frontend:** HTML, CSS, JavaScript (served from Spring Boot static resources)
- **API Docs:** SpringDoc OpenAPI (Swagger UI at `/docs`)
- **Containerized:** Docker (multi-stage build)

## API

| Method   | Endpoint              | Description                     |
|----------|-----------------------|---------------------------------|
| `POST`   | `/api/book`           | Book a room                     |
| `GET`    | `/api/bookings/{roomId}` | Get bookings for a specific room |
| `DELETE` | `/api/booking/{id}`   | Cancel a booking                |

### Booking Request

```json
{
  "roomId": "A",
  "startTime": "2026-03-25T10:00:00",
  "endTime": "2026-03-25T11:00:00"
}
```

### Responses

On success:
```json
{ "status": "success", "message": "Booking successful" }
```

On conflict (returns a suggested available slot):
```json
{
  "status": "conflict",
  "message": "Slot not available",
  "suggestedStart": "2026-03-25T11:00:00",
  "suggestedEnd": "2026-03-25T12:00:00"
}
```

## Rooms

Currently configured with 3 rooms — `A`, `B`, `C`. Adding more is straightforward:

```java
// BookingService.java
roomBookings.put("D", new ArrayList<>());
```

Data is stored in-memory (HashMap), so bookings reset on restart.

## Running Locally

```bash
./mvnw spring-boot:run
```

App runs at `http://localhost:8080`. API docs at `http://localhost:8080/docs`.

### Docker

```bash
docker build -t meetroom .
docker run -p 8080:8080 meetroom
```

## Project Structure

```
src/main/java/com/example/meetingRoom/
├── controller/BookingController.java    # REST endpoints
├── service/BookingService.java          # Booking logic, conflict detection
├── model/
│   ├── Booking.java                     # Entity
│   ├── BookingRequest.java              # Request DTO
│   └── BookingResponse.java             # Response DTO
└── exceptions/
    ├── BadRequestException.java
    └── GlobalExceptionHandler.java      # Global error handling

src/main/resources/static/               # Frontend assets
frontend/                                # Frontend source
```
