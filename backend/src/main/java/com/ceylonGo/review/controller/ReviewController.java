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

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ----- Create Review -----

    @PostMapping
    public ApiResponse<ReviewResponse> create(
            @Valid @RequestBody ReviewRequest request
    ) {
        return ApiResponse.ok(
                "Review created",
                reviewService.create(
                        SecurityUtils.currentUserId(),
                        request
                )
        );
    }

    // ----- Destination Reviews -----

    @GetMapping("/destination/{destinationId}")
    public ApiResponse<Page<ReviewResponse>> forDestination(
            @PathVariable Long destinationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rating_desc") String sort
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                resolveSort(sort)
        );

        return ApiResponse.ok(
                reviewService.getForDestination(
                        destinationId,
                        pageable
                )
        );
    }

    // ----- Guide Reviews -----

    @GetMapping("/guide/{guideId}")
    public ApiResponse<Page<ReviewResponse>> forGuide(
            @PathVariable Long guideId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "rating_desc") String sort
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                resolveSort(sort)
        );

        return ApiResponse.ok(
                reviewService.getForGuide(
                        guideId,
                        pageable
                )
        );
    }

    // ----- Sort Resolution -----

    /**
     * Translates the "sort" query param into a Sort object. Defaults to
     * best-rating-first ("rating_desc") to match the frontend's default view.
     */
    private Sort resolveSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "rating");
        }

        switch (sort) {
            case "rating_asc":
                return Sort.by(Sort.Direction.ASC, "rating");
            case "newest":
                return Sort.by(Sort.Direction.DESC, "createdAt");
            case "rating_desc":
            default:
                return Sort.by(Sort.Direction.DESC, "rating");
        }
    }

    // ----- My Reviews -----

    @GetMapping("/mine")
    public ApiResponse<Page<ReviewResponse>> myReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Direction.DESC,
                        "createdAt"
                )
        );

        return ApiResponse.ok(
                reviewService.getMine(
                        SecurityUtils.currentUserId(),
                        pageable
                )
        );
    }

    // ----- Get One Review -----

    @GetMapping("/{id}")
    public ApiResponse<ReviewResponse> getById(
            @PathVariable Long id
    ) {
        return ApiResponse.ok(
                reviewService.getById(id)
        );
    }

    // ----- Update Own Review -----

    @PutMapping("/{id}")
    public ApiResponse<ReviewResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request
    ) {
        return ApiResponse.ok(
                "Review updated",
                reviewService.update(
                        id,
                        SecurityUtils.currentUserId(),
                        request
                )
        );
    }

    // ----- Delete Own Review -----

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable Long id
    ) {
        reviewService.delete(
                id,
                SecurityUtils.currentUserId()
        );

        return ApiResponse.ok(
                "Review deleted",
                null
        );
    }

    // ----- Flag Review -----

    @PostMapping("/{id}/flag")
    public ApiResponse<ReviewResponse> flag(
            @PathVariable Long id
    ) {
        return ApiResponse.ok(
                "Review flagged",
                reviewService.flag(
                        id,
                        SecurityUtils.currentUserId()
                )
        );
    }
}