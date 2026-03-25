package com.example.meetingRoom.service;

import com.example.meetingRoom.exceptions.BadRequestException;
import com.example.meetingRoom.model.Booking;
import com.example.meetingRoom.model.BookingRequest;
import com.example.meetingRoom.model.BookingResponse;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingService {

    private final Map<String, List<Booking>> roomBookings = new HashMap<>();

    public BookingService(){
        roomBookings.put("A", new ArrayList<>());
        roomBookings.put("B", new ArrayList<>());
        roomBookings.put("C", new ArrayList<>());
    }

    public BookingResponse book(BookingRequest request) {
        // room validation
        if(!roomBookings.containsKey(request.getRoomId())){
            throw new BadRequestException("Invalid room");
        }

        //time validation
        if(request.getStartTime().isAfter(request.getEndTime()) ||
        request.getStartTime().equals(request.getEndTime())){
            throw new BadRequestException("Invalid time range");
        }

        List<Booking> bookings = roomBookings.get(request.getRoomId());

        Booking newBooking = new Booking(request.getRoomId(), request.getStartTime(), request.getEndTime());

        //check conflict

        if(isConflict(bookings, newBooking)){
            Duration duration = Duration.between(
                    request.getStartTime(),
                    request.getEndTime()
            );

            LocalDateTime suggestedStart = findNextSlot(bookings, request.getStartTime(), duration);

            return new BookingResponse(
                    "conflict",
                    "Slot not available",
                    suggestedStart,
                    suggestedStart.plus(duration)
            );
        }

        //add booking
        bookings.add(newBooking);


        //sort bookings
        bookings.sort(Comparator.comparing(Booking::getStartTime));
        return new BookingResponse("success", "Booking successful");

    }

    private boolean isConflict(List<Booking> bookings, Booking newBooking){
        for(Booking b: bookings){
            if(newBooking.getStartTime().isBefore(b.getEndTime()) && newBooking.getEndTime().isAfter(b.getStartTime())){
                return true;
            }
        }
        return false;
    }

    private LocalDateTime findNextSlot(List<Booking> bookings, LocalDateTime requestedStart, Duration duration){
        if(bookings.isEmpty() || Duration.between(requestedStart, bookings.getFirst().getStartTime()).compareTo(duration) >= 0){
            return requestedStart;
        }

        for(int i = 0; i<bookings.size()-1; i++){
            LocalDateTime gapStart = bookings.get(i).getEndTime();
            LocalDateTime gapEnd = bookings.get(i+1).getStartTime();

            if(Duration.between(gapStart, gapEnd).compareTo(duration) >= 0){
                return gapStart;
            }
        }
        return bookings.getLast().getEndTime();
    }

    public List<Booking> getBookings(String roomId) {
        return roomBookings.getOrDefault(roomId, new ArrayList<>());
    }

    public BookingResponse deleteBooking(String id) {
        for(List<Booking> bookings: roomBookings.values()){
            Iterator<Booking> iterator = bookings.iterator();

            while(iterator.hasNext()){
                Booking b = iterator.next();

                if(b.getId().equals(id)){
                    iterator.remove();
                    return new BookingResponse("success", "Booking deleted");
                }
            }
        }
        throw new BadRequestException("Invalid room");
    }
}
