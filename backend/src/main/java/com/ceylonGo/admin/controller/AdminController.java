package com.ceylonGo.admin.controller;

import com.ceylonGo.admin.dto.AdminStatsResponse;
import com.ceylonGo.admin.service.AdminService;
import com.ceylonGo.auth.dto.UserProfileDto;
import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.destination.dto.DestinationRequest;
import com.ceylonGo.destination.dto.DestinationResponse;
import com.ceylonGo.destination.service.DestinationService;
import com.ceylonGo.guide.dto.GuideResponse;
import com.ceylonGo.review.dto.ReviewResponse;
import com.ceylonGo.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * All endpoints in this controller are restricted to ADMIN (see SecurityConfig:
 * "/api/admin/**" requires ROLE_ADMIN), so no per-method @PreAuthorize is needed here.
 * Destination and review moderation reuse the existing services rather than
 * duplicating logic.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final DestinationService destinationService;
    private final ReviewService reviewService;

    public AdminController(AdminService adminService, DestinationService destinationService, ReviewService reviewService) {
        this.adminService = adminService;
        this.destinationService = destinationService;
        this.reviewService = reviewService;
    }

    @GetMapping("/stats")
    public ApiResponse<AdminStatsResponse> stats() {
        return ApiResponse.ok(adminService.getStats());
    }

    // ----- Users -----
    @GetMapping("/users")
    public ApiResponse<List<UserProfileDto>> listUsers() {
        return ApiResponse.ok(adminService.listUsers());
    }

    @PatchMapping("/users/{id}/active")
    public ApiResponse<Void> setUserActive(@PathVariable Long id, @RequestParam boolean active) {
        adminService.setUserActive(id, active);
        return ApiResponse.ok(active ? "User activated" : "User deactivated", null);
    }

    // ----- Guides -----
    @GetMapping("/guides")
    public ApiResponse<List<GuideResponse>> listGuides() {
        return ApiResponse.ok(adminService.listAllGuides());
    }

    @PatchMapping("/guides/{id}/verify")
    public ApiResponse<GuideResponse> verifyGuide(@PathVariable Long id, @RequestParam boolean verified) {
        return ApiResponse.ok(verified ? "Guide verified" : "Guide verification removed",
                adminService.verifyGuide(id, verified));
    }

    // ----- Destinations -----
    @PostMapping("/destinations")
    public ApiResponse<DestinationResponse> createDestination(@Valid @RequestBody DestinationRequest request) {
        return ApiResponse.ok("Destination created", destinationService.create(request));
    }

    @PutMapping("/destinations/{id}")
    public ApiResponse<DestinationResponse> updateDestination(@PathVariable Long id, @Valid @RequestBody DestinationRequest request) {
        return ApiResponse.ok("Destination updated", destinationService.update(id, request));
    }

    @DeleteMapping("/destinations/{id}")
    public ApiResponse<Void> deleteDestination(@PathVariable Long id) {
        destinationService.delete(id);
        return ApiResponse.ok("Destination deleted", null);
    }

    // ----- Reviews (moderation) -----
    @GetMapping("/reviews/flagged")
    public ApiResponse<Page<ReviewResponse>> flaggedReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(reviewService.getFlagged(pageable));
    }

    @DeleteMapping("/reviews/{id}")
    public ApiResponse<Void> deleteReview(@PathVariable Long id) {
        reviewService.delete(id);
        return ApiResponse.ok("Review deleted", null);
    }
}
