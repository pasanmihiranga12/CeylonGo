package com.ceylonGo.admin.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.admin.dto.AdminStatsResponse;
import com.ceylonGo.auth.dto.UserProfileDto;
import com.ceylonGo.auth.model.Role;
import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.repository.UserRepository;
import com.ceylonGo.booking.model.BookingStatus;
import com.ceylonGo.booking.repository.BookingRepository;
import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.destination.repository.DestinationRepository;
import com.ceylonGo.guide.dto.GuideResponse;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.repository.GuideProfileRepository;
import com.ceylonGo.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final DestinationRepository destinationRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public AdminService(UserRepository userRepository,
                        GuideProfileRepository guideProfileRepository,
                        DestinationRepository destinationRepository,
                        BookingRepository bookingRepository,
                        ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.guideProfileRepository = guideProfileRepository;
        this.destinationRepository = destinationRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    public AdminStatsResponse getStats() {
        AdminStatsResponse stats = new AdminStatsResponse();
        List<User> allUsers = userRepository.findAll();

        stats.setTotalUsers(allUsers.size());
        stats.setTotalTourists(allUsers.stream().filter(u -> u.getRole() == Role.TOURIST).count());
        stats.setTotalGuides(allUsers.stream().filter(u -> u.getRole() == Role.GUIDE).count());
        stats.setVerifiedGuides(guideProfileRepository.findAll().stream().filter(GuideProfile::isVerified).count());
        stats.setTotalDestinations(destinationRepository.count());
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING));
        stats.setConfirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        stats.setTotalReviews(reviewRepository.count());
        stats.setFlaggedReviews(reviewRepository.findByFlaggedTrue(org.springframework.data.domain.Pageable.unpaged()).getTotalElements());

        return stats;
    }

    public List<UserProfileDto> listUsers() {
        return userRepository.findAll().stream().map(UserProfileDto::fromEntity).toList();
    }

    public void setUserActive(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(active);
        userRepository.save(user);
    }

    public List<GuideResponse> listAllGuides() {
        return guideProfileRepository.findAll().stream().map(GuideResponse::fromEntity).toList();
    }

    public GuideResponse verifyGuide(Long guideId, boolean verified) {
        GuideProfile guide = guideProfileRepository.findById(guideId)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found"));
        guide.setVerified(verified);
        return GuideResponse.fromEntity(guideProfileRepository.save(guide));
    }
}