package com.ceylonGo.review.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import com.ceylonGo.review.dto.ReviewRequest;
import com.ceylonGo.review.dto.ReviewResponse;
import com.ceylonGo.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> create(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.create(SecurityUtils.currentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Review submitted", response));
    }

    @GetMapping("/destination/{destinationId}")
    public ApiResponse<Page<ReviewResponse>> forDestination(
            @PathVariable Long destinationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.ok(reviewService.getForDestination(destinationId, pageable));
    }

    @GetMapping("/guide/{guideId}")
    public ApiResponse<Page<ReviewResponse>> forGuide(
            @PathVariable Long guideId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.ok(reviewService.getForGuide(guideId, pageable));
    }

    @GetMapping("/mine")
    public ApiResponse<Page<ReviewResponse>> myReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.ok(reviewService.getMine(com.ceylonGo.config.SecurityUtils.currentUserId(), pageable));
    }

    @PostMapping("/{id}/flag")
    public ApiResponse<ReviewResponse> flag(@PathVariable Long id) {
        return ApiResponse.ok("Review flagged for moderation", reviewService.flag(id));
    }
}