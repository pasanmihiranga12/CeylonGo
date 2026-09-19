package com.ceylonGo.review.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.common.BadRequestException;
import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.destination.model.Destination;
import com.ceylonGo.destination.repository.DestinationRepository;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.service.GuideService;
import com.ceylonGo.review.dto.ReviewRequest;
import com.ceylonGo.review.dto.ReviewResponse;
import com.ceylonGo.review.model.Review;
import com.ceylonGo.review.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DestinationRepository destinationRepository;
    private final GuideService guideService;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository,
                         DestinationRepository destinationRepository,
                         GuideService guideService,
                         UserService userService) {
        this.reviewRepository = reviewRepository;
        this.destinationRepository = destinationRepository;
        this.guideService = guideService;
        this.userService = userService;
    }

    public ReviewResponse create(Long reviewerId, ReviewRequest request) {
        if ((request.getDestinationId() == null) == (request.getGuideId() == null)) {
            throw new BadRequestException("A review must target exactly one destination OR one guide");
        }

        User reviewer = userService.getUserEntity(reviewerId);

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        if (request.getDestinationId() != null) {
            Destination destination = destinationRepository.findById(request.getDestinationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));
            review.setDestination(destination);
            reviewRepository.save(review);
            recalculateDestinationRating(destination);
        } else {
            GuideProfile guide = guideService.getGuideEntity(request.getGuideId());
            review.setGuide(guide);
            reviewRepository.save(review);
        }

        return ReviewResponse.fromEntity(review);
    }

    public Page<ReviewResponse> getForDestination(Long destinationId, Pageable pageable) {
        return reviewRepository.findByDestinationIdOrderByCreatedAtDesc(destinationId, pageable)
                .map(ReviewResponse::fromEntity);
    }

    public Page<ReviewResponse> getForGuide(Long guideId, Pageable pageable) {
        return reviewRepository.findByGuideIdOrderByCreatedAtDesc(guideId, pageable)
                .map(ReviewResponse::fromEntity);
    }

    public Page<ReviewResponse> getMine(Long reviewerId, Pageable pageable) {
        return reviewRepository.findByReviewerIdOrderByCreatedAtDesc(reviewerId, pageable)
                .map(ReviewResponse::fromEntity);
    }

    public ReviewResponse flag(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setFlagged(true);
        return ReviewResponse.fromEntity(reviewRepository.save(review));
    }

    public Page<ReviewResponse> getFlagged(Pageable pageable) {
        return reviewRepository.findByFlaggedTrue(pageable).map(ReviewResponse::fromEntity);
    }

    public void delete(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        Destination destination = review.getDestination();
        reviewRepository.delete(review);
        if (destination != null) {
            recalculateDestinationRating(destination);
        }
    }

    private void recalculateDestinationRating(Destination destination) {
        List<Review> reviews = reviewRepository.findByDestinationId(destination.getId());
        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        destination.setAverageRating(Math.round(average * 10.0) / 10.0);
        destination.setReviewCount(reviews.size());
        destinationRepository.save(destination);
    }
}