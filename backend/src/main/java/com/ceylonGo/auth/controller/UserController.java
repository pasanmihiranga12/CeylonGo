package com.ceylonGo.auth.controller;

import com.ceylonGo.auth.dto.UpdateProfileRequest;
import com.ceylonGo.auth.dto.UserProfileDto;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ApiResponse<UserProfileDto> getMyProfile() {
        return ApiResponse.ok(userService.getProfile(SecurityUtils.currentUserId()));
    }

    @PutMapping("/me")
    public ApiResponse<UserProfileDto> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok("Profile updated", userService.updateProfile(SecurityUtils.currentUserId(), request));
    }
}
