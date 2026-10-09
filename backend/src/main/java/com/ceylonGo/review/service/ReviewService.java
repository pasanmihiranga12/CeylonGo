package com.ceylonGo.review.service;

import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.booking.model.BookingStatus;
import com.ceylonGo.booking.repository.BookingRepository;
import com.ceylonGo.common.BadRequestException;
import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.destination.model.Destination;
import com.ceylonGo.destination.service.DestinationService;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.service.GuideService;
import com.ceylonGo.review.dto.ReviewRequest;
import com.ceylonGo.review.dto.ReviewResponse;
import com.ceylonGo.review.model.Review;
import com.ceylonGo.review.observer.ReviewObserver;
import com.ceylonGo.review.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final DestinationService destinationService;
    private final GuideService guideService;
    private final BookingRepository bookingRepository;

    // Observer pattern: Spring autowires every ReviewObserver bean here (today
    // just RatingRecalculationObserver). A second observer - e.g. a logging one -
    // could be added as its own @Component without touching this service at all.
    private final List<ReviewObserver> reviewObservers;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserService userService,
            DestinationService destinationService,
            GuideService guideService,
            BookingRepository bookingRepository,
            List<ReviewObserver> reviewObservers
    ) {
        this.reviewRepository = reviewRepository;
        this.userService = userService;
        this.destinationService = destinationService;
        this.guideService = guideService;
        this.bookingRepository = bookingRepository;
        this.reviewObservers = reviewObservers;
    }

    private void notifyObservers(Review review) {
        reviewObservers.forEach(observer -> observer.onReviewChanged(review));
    }

    // ----- Create Review -----

    public ReviewResponse create(
            Long userId,
            ReviewRequest request
    ) {
        User reviewer = userService.getUserEntity(userId);

        if (request.getDestinationId() == null
                && request.getGuideId() == null) {

            throw new BadRequestException(
                    "A destination or guide is required"
            );
        }

        /*
         * A review is allowed only after the guide
         * has confirmed the tourist's booking.
         */
        if (request.getGuideId() != null) {

            boolean hasConfirmedBooking =
                    bookingRepository
                            .findByTouristIdOrderByBookingDateDesc(userId)
                            .stream()
                            .anyMatch(booking ->
                                    booking.getGuide()
                                            .getId()
                                            .equals(request.getGuideId())
                                            && booking.getStatus()
                                            == BookingStatus.CONFIRMED
                            );

            if (!hasConfirmedBooking) {
                throw new BadRequestException(
                        "You can only review after your booking has been confirmed"
                );
            }
        }

        // ----- Destination Review -----

        if (request.getDestinationId() != null) {

            Destination destination =
                    destinationService.getEntity(
                            request.getDestinationId()
                    );

            Review review = new Review();

            review.setReviewer(reviewer);
            review.setDestination(destination);
            review.setRating(request.getRating());
            review.setComment(request.getComment());

            Review saved = reviewRepository.save(review);
            notifyObservers(saved);

            return ReviewResponse.fromEntity(saved);
        }

        // ----- Guide Review -----

        GuideProfile guide =
                guideService.getGuideEntity(
                        request.getGuideId()
                );

        Review review = new Review();

        review.setReviewer(reviewer);
        review.setGuide(guide);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        notifyObservers(saved);

        return ReviewResponse.fromEntity(saved);
    }

    // ----- Destination Reviews -----

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getForDestination(
            Long destinationId,
            Pageable pageable
    ) {
        return reviewRepository
                .findByDestinationId(
                        destinationId,
                        pageable
                )
                .map(ReviewResponse::fromEntity);
    }

    // ----- Guide Reviews -----

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getForGuide(
            Long guideId,
            Pageable pageable
    ) {
        return reviewRepository
                .findByGuideId(
                        guideId,
                        pageable
                )
                .map(ReviewResponse::fromEntity);
    }

    // ----- My Reviews -----

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getMine(
            Long userId,
            Pageable pageable
    ) {
        return reviewRepository
                .findByReviewerIdOrderByCreatedAtDesc(
                        userId,
                        pageable
                )
                .map(ReviewResponse::fromEntity);
    }

    // ----- Get Review -----

    @Transactional(readOnly = true)
    public ReviewResponse getById(Long id) {

        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found"
                                )
                        );

        return ReviewResponse.fromEntity(review);
    }

    // ----- Update Own Review -----

    public ReviewResponse update(
            Long id,
            Long userId,
            ReviewRequest request
    ) {
        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found"
                                )
                        );

        if (!review.getReviewer()
                .getId()
                .equals(userId)) {

            throw new BadRequestException(
                    "You can only edit your own review"
            );
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        notifyObservers(saved);

        return ReviewResponse.fromEntity(saved);
    }

    // ----- Delete Own Review -----

    public void delete(
            Long id,
            Long userId
    ) {
        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found"
                                )
                        );

        if (!review.getReviewer()
                .getId()
                .equals(userId)) {

            throw new BadRequestException(
                    "You can only delete your own review"
            );
        }

        reviewRepository.delete(review);
        notifyObservers(review);
    }

    // ----- Delete Review as Admin -----

    public void deleteByAdmin(Long id) {

        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found"
                                )
                        );

        reviewRepository.delete(review);
        notifyObservers(review);
    }

    // ----- Flag Review -----

    public ReviewResponse flag(
            Long id,
            Long userId
    ) {
        Review review =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found"
                                )
                        );

        review.setFlagged(true);

        return ReviewResponse.fromEntity(
                reviewRepository.save(review)
        );
    }

    // ----- Get Flagged Reviews -----

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getFlagged(
            Pageable pageable
    ) {
        return reviewRepository
                .findByFlaggedTrue(pageable)
                .map(ReviewResponse::fromEntity);
    }

    // ----- Get All Reviews (admin) -----

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getAllForAdmin(
            Pageable pageable
    ) {
        return reviewRepository
                .findAll(pageable)
                .map(ReviewResponse::fromEntity);
    }
}