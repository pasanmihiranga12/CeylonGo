package com.ceylonGo.booking.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.booking.dto.BookingRequest;
import com.ceylonGo.booking.dto.BookingResponse;
import com.ceylonGo.booking.model.Booking;
import com.ceylonGo.booking.model.BookingStatus;
import com.ceylonGo.booking.repository.BookingRepository;
import com.ceylonGo.common.BadRequestException;
import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.service.GuideService;
import com.ceylonGo.notification.service.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final GuideService guideService;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, UserService userService,
                          GuideService guideService, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.guideService = guideService;
        this.notificationService = notificationService;
    }

    public BookingResponse create(Long touristId, BookingRequest request) {
        User tourist = userService.getUserEntity(touristId);
        GuideProfile guide = guideService.getGuideEntity(request.getGuideId());

        Booking booking = new Booking();
        booking.setTourist(tourist);
        booking.setGuide(guide);
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        // Payment is simulated only - estimate a flat amount from the guide's hourly rate if set.
        if (guide.getHourlyRate() != null) {
            booking.setSimulatedAmount(guide.getHourlyRate());
        }

        Booking saved = bookingRepository.save(booking);
        notificationService.notify(guide.getUser().getId(),
                tourist.getName() + " requested a booking on " + booking.getBookingDate(), "BOOKING_UPDATE");

        return BookingResponse.fromEntity(saved);
    }

    public List<BookingResponse> getMyBookingsAsTourist(Long touristId) {
        return bookingRepository.findByTouristIdOrderByBookingDateDesc(touristId)
                .stream().map(BookingResponse::fromEntity).toList();
    }

    /** Bookings received by the calling user in their capacity as a guide. */
    public List<BookingResponse> getMyBookingsAsGuide(Long userId) {
        GuideProfile guide = guideService.getGuideEntity(guideProfileIdForUser(userId));
        return bookingRepository.findByGuideIdOrderByBookingDateDesc(guide.getId())
                .stream().map(BookingResponse::fromEntity).toList();
    }

    public BookingResponse getById(Long id, Long userId) {
        Booking booking = getOwnedEntity(id, userId);
        return BookingResponse.fromEntity(booking);
    }

    /** Guide accepts/rejects, or either party cancels a pending booking. */
    public BookingResponse updateStatus(Long id, Long userId, BookingStatus newStatus) {
        Booking booking = getOwnedEntity(id, userId);

        boolean isGuide = booking.getGuide().getUser().getId().equals(userId);
        boolean isTourist = booking.getTourist().getId().equals(userId);

        if (newStatus == BookingStatus.CANCELLED) {
            if (!isGuide && !isTourist) {
                throw new BadRequestException("You do not have access to this booking");
            }
        } else if (newStatus == BookingStatus.CONFIRMED) {
            if (!isGuide) {
                throw new BadRequestException("Only the guide can confirm a booking");
            }
        }

        booking.setStatus(newStatus);
        Booking saved = bookingRepository.save(booking);

        notificationService.notify(booking.getTourist().getId(),
                "Your booking on " + booking.getBookingDate() + " is now " + newStatus, "BOOKING_UPDATE");

        return BookingResponse.fromEntity(saved);
    }

    /** Simulates taking payment for a confirmed booking (no real payment gateway). */
    public BookingResponse simulatePayment(Long id, Long touristId) {
        Booking booking = getOwnedEntity(id, touristId);
        if (!booking.getTourist().getId().equals(touristId)) {
            throw new BadRequestException("Only the tourist who made the booking can pay for it");
        }
        booking.setPaymentSimulated(true);
        return BookingResponse.fromEntity(bookingRepository.save(booking));
    }

    private Booking getOwnedEntity(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        boolean isGuide = booking.getGuide().getUser().getId().equals(userId);
        boolean isTourist = booking.getTourist().getId().equals(userId);

        if (!isGuide && !isTourist) {
            throw new BadRequestException("You do not have access to this booking");
        }
        return booking;
    }

    private Long guideProfileIdForUser(Long userId) {
        return guideService.getMyProfile(userId).getId();
    }
}