package com.example.meetingRoom.controller;

import com.example.meetingRoom.model.Booking;
import com.example.meetingRoom.model.BookingRequest;
import com.example.meetingRoom.model.BookingResponse;
import com.example.meetingRoom.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    //create booking
    @PostMapping("/book")
    public BookingResponse book(@RequestBody BookingRequest request) {
        return bookingService.book(request);
    }

    //get bookings for a room
    @GetMapping("/bookings/{roomId}")
    public List<Booking> getBookingsForRoom(@PathVariable String roomId) {
        return bookingService.getBookings(roomId);
    }

    @DeleteMapping("/booking/{id}")
    public BookingResponse deleteBooking(@PathVariable String id) {
        return bookingService.deleteBooking(id);
    }
}
