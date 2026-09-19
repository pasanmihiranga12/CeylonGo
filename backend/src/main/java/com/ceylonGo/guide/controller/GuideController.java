package com.ceylonGo.guide.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import com.ceylonGo.guide.dto.GuideProfileRequest;
import com.ceylonGo.guide.dto.GuideResponse;
import com.ceylonGo.guide.service.GuideService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public ApiResponse<Page<GuideResponse>> listGuides(
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<GuideResponse> result = (language == null || language.isBlank())
                ? guideService.listVerifiedGuides(pageable)
                : guideService.searchByLanguage(language, pageable);

        return ApiResponse.ok(result);
    }

    @GetMapping("/{id}")
    public ApiResponse<GuideResponse> getGuide(@PathVariable Long id) {
        return ApiResponse.ok(guideService.getGuideById(id));
    }

    @GetMapping("/me")
    public ApiResponse<GuideResponse> getMyGuideProfile() {
        return ApiResponse.ok(guideService.getMyProfile(SecurityUtils.currentUserId()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('GUIDE')")
    public ApiResponse<GuideResponse> updateMyGuideProfile(@RequestBody GuideProfileRequest request) {
        return ApiResponse.ok("Guide profile saved", guideService.upsertMyProfile(SecurityUtils.currentUserId(), request));
    }
}
