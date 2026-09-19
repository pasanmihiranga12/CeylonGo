package com.ceylonGo.booking.dto;

import com.ceylonGo.booking.model.Booking;
import com.ceylonGo.booking.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponse {
    private Long id;
    private Long touristId;
    private String touristName;
    private Long guideId;
    private String guideName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private BookingStatus status;
    private String notes;
    private Double simulatedAmount;
    private boolean paymentSimulated;
    private LocalDateTime createdAt;

    public static BookingResponse fromEntity(Booking b) {
        BookingResponse dto = new BookingResponse();
        dto.id = b.getId();
        dto.touristId = b.getTourist().getId();
        dto.touristName = b.getTourist().getName();
        dto.guideId = b.getGuide().getId();
        dto.guideName = b.getGuide().getUser().getName();
        dto.bookingDate = b.getBookingDate();
        dto.bookingTime = b.getBookingTime();
        dto.status = b.getStatus();
        dto.notes = b.getNotes();
        dto.simulatedAmount = b.getSimulatedAmount();
        dto.paymentSimulated = b.isPaymentSimulated();
        dto.createdAt = b.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public Long getTouristId() { return touristId; }
    public String getTouristName() { return touristName; }
    public Long getGuideId() { return guideId; }
    public String getGuideName() { return guideName; }
    public LocalDate getBookingDate() { return bookingDate; }
    public LocalTime getBookingTime() { return bookingTime; }
    public BookingStatus getStatus() { return status; }
    public String getNotes() { return notes; }
    public Double getSimulatedAmount() { return simulatedAmount; }
    public boolean isPaymentSimulated() { return paymentSimulated; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
