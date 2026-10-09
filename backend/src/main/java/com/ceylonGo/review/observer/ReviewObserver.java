package com.ceylonGo.review.observer;

import com.ceylonGo.review.model.Review;

/**
 * Observer pattern: implementations react to a review being created,
 * updated or deleted, without {@code ReviewService} needing to know what
 * they do. Spring autowires every bean implementing this interface into
 * {@code ReviewService}'s {@code List<ReviewObserver>}, so a new observer
 * (e.g. a logging one) can be added just by adding a @Component - no
 * change needed in ReviewService itself.
 */
public interface ReviewObserver {

    void onReviewChanged(Review review);
}
