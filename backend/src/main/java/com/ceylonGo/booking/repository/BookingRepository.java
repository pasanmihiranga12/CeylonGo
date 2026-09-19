package com.ceylonGo.booking.repository;

import com.ceylonGo.booking.model.Booking;
import com.ceylonGo.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTouristIdOrderByBookingDateDesc(Long touristId);
    List<Booking> findByGuideIdOrderByBookingDateDesc(Long guideId);
    long countByGuideIdAndStatus(Long guideId, BookingStatus status);
    long countByStatus(BookingStatus status);
}
