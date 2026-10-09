package com.ceylonGo.review.observer;

import com.ceylonGo.destination.model.Destination;
import com.ceylonGo.destination.repository.DestinationRepository;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.repository.GuideProfileRepository;
import com.ceylonGo.review.model.Review;
import com.ceylonGo.review.repository.ReviewRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Recomputes and persists the cached average rating for whichever target
 * (destination or guide) a changed review points at. This is the one
 * concrete {@link ReviewObserver} wired into {@code ReviewService} today;
 * nothing stops a second observer (e.g. a simple logging one) from being
 * added later as its own @Component - ReviewService would pick it up
 * automatically without any change there.
 */
@Component
public class RatingRecalculationObserver implements ReviewObserver {

    private final ReviewRepository reviewRepository;
    private final DestinationRepository destinationRepository;
    private final GuideProfileRepository guideProfileRepository;

    public RatingRecalculationObserver(
            ReviewRepository reviewRepository,
            DestinationRepository destinationRepository,
            GuideProfileRepository guideProfileRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.destinationRepository = destinationRepository;
        this.guideProfileRepository = guideProfileRepository;
    }

    @Override
    public void onReviewChanged(Review review) {
        if (review.getDestination() != null) {
            recalculateDestination(review.getDestination().getId());
        } else if (review.getGuide() != null) {
            recalculateGuide(review.getGuide().getId());
        }
    }

    private void recalculateDestination(Long destinationId) {
        Destination destination = destinationRepository.findById(destinationId).orElse(null);
        if (destination == null) {
            return;
        }
        List<Review> reviews = reviewRepository.findByDestinationId(destinationId);
        destination.setAverageRating(average(reviews));
        destinationRepository.save(destination);
    }

    private void recalculateGuide(Long guideId) {
        GuideProfile guide = guideProfileRepository.findById(guideId).orElse(null);
        if (guide == null) {
            return;
        }
        List<Review> reviews = reviewRepository.findByGuideId(guideId);
        guide.setAverageRating(average(reviews));
        guideProfileRepository.save(guide);
    }

    private Double average(List<Review> reviews) {
        if (reviews.isEmpty()) {
            return null;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
