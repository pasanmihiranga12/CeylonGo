package com.ceylonGo.review.dto;

import com.ceylonGo.review.model.Review;

import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long destinationId;
    private String destinationName;
    private Long guideId;
    private String guideName;
    private Integer rating;
    private String comment;
    private boolean flagged;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(Review r) {
        ReviewResponse dto = new ReviewResponse();
        dto.id = r.getId();
        dto.reviewerId = r.getReviewer().getId();
        dto.reviewerName = r.getReviewer().getName();
        dto.destinationId = r.getDestination() != null ? r.getDestination().getId() : null;
        dto.destinationName = r.getDestination() != null ? r.getDestination().getName() : null;
        dto.guideId = r.getGuide() != null ? r.getGuide().getId() : null;
        dto.guideName = r.getGuide() != null ? r.getGuide().getUser().getName() : null;
        dto.rating = r.getRating();
        dto.comment = r.getComment();
        dto.flagged = r.isFlagged();
        dto.createdAt = r.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public Long getReviewerId() { return reviewerId; }
    public String getReviewerName() { return reviewerName; }
    public Long getDestinationId() { return destinationId; }
    public String getDestinationName() { return destinationName; }
    public Long getGuideId() { return guideId; }
    public String getGuideName() { return guideName; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public boolean isFlagged() { return flagged; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}