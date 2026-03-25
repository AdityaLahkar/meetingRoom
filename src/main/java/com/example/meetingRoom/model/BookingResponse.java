package com.example.meetingRoom.model;

import java.time.LocalDateTime;

public class BookingResponse {
    private String status;
    private String message;
    private LocalDateTime suggestedStart;
    private LocalDateTime suggestedEnd;

    public BookingResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public BookingResponse(String status, String message, LocalDateTime suggestedStart, LocalDateTime suggestedEnd) {
        this.status = status;
        this.message = message;
        this.suggestedStart = suggestedStart;
        this.suggestedEnd = suggestedEnd;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSuggestedStart() {
        return suggestedStart;
    }

    public void setSuggestedStart(LocalDateTime suggestedStart) {
        this.suggestedStart = suggestedStart;
    }

    public LocalDateTime getSuggestedEnd() {
        return suggestedEnd;
    }

    public void setSuggestedEnd(LocalDateTime suggestedEnd) {
        this.suggestedEnd = suggestedEnd;
    }
}
