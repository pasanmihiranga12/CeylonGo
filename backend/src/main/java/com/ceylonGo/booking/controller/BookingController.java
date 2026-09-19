package com.ceylonGo.booking.controller;

import com.ceylonGo.booking.dto.BookingRequest;
import com.ceylonGo.booking.dto.BookingResponse;
import com.ceylonGo.booking.dto.BookingStatusUpdateRequest;
import com.ceylonGo.booking.service.BookingService;
import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TOURIST')")
    public ResponseEntity<ApiResponse<BookingResponse>> create(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.create(SecurityUtils.currentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Booking request sent", response));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TOURIST')")
    public ApiResponse<List<BookingResponse>> myBookings() {
        return ApiResponse.ok(bookingService.getMyBookingsAsTourist(SecurityUtils.currentUserId()));
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('GUIDE')")
    public ApiResponse<List<BookingResponse>> receivedBookings() {
        return ApiResponse.ok(bookingService.getMyBookingsAsGuide(SecurityUtils.currentUserId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<BookingResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(bookingService.getById(id, SecurityUtils.currentUserId()));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<BookingResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody BookingStatusUpdateRequest request) {
        return ApiResponse.ok("Booking status updated", bookingService.updateStatus(id, SecurityUtils.currentUserId(), request.getStatus()));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('TOURIST')")
    public ApiResponse<BookingResponse> simulatePayment(@PathVariable Long id) {
        return ApiResponse.ok("Payment simulated", bookingService.simulatePayment(id, SecurityUtils.currentUserId()));
    }
}
