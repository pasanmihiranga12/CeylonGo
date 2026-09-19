package com.ceylonGo.review.repository;

import com.ceylonGo.review.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByDestinationIdOrderByCreatedAtDesc(Long destinationId, Pageable pageable);
    Page<Review> findByGuideIdOrderByCreatedAtDesc(Long guideId, Pageable pageable);
    Page<Review> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId, Pageable pageable);
    java.util.List<Review> findByDestinationId(Long destinationId);
    java.util.List<Review> findByGuideId(Long guideId);
    Page<Review> findByFlaggedTrue(Pageable pageable);
}