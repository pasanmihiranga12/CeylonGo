package com.ceylonGo.review.repository;

import com.ceylonGo.review.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByDestinationIdOrderByCreatedAtDesc(Long destinationId, Pageable pageable);
    Page<Review> findByGuideIdOrderByCreatedAtDesc(Long guideId, Pageable pageable);
    Page<Review> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId, Pageable pageable);

    // Sort-aware variants: the ordering is fully controlled by the Sort carried
    // in the Pageable (see ReviewController#resolveSort), so no OrderBy clause
    // is baked into the method name here.
    Page<Review> findByDestinationId(Long destinationId, Pageable pageable);
    Page<Review> findByGuideId(Long guideId, Pageable pageable);
    java.util.List<Review> findByDestinationId(Long destinationId);
    java.util.List<Review> findByGuideId(Long guideId);
    Page<Review> findByFlaggedTrue(Pageable pageable);
    boolean existsByReviewerIdAndDestinationId(Long reviewerId, Long destinationId);
    boolean existsByReviewerIdAndGuideId(Long reviewerId, Long guideId);
}