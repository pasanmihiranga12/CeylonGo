package com.ceylonGo.auth.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.auth.dto.UpdateProfileRequest;
import com.ceylonGo.auth.dto.UserProfileDto;
import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.repository.UserRepository;
import com.ceylonGo.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public UserProfileDto getProfile(Long id) {
        return UserProfileDto.fromEntity(getUserEntity(id));
    }

    public UserProfileDto updateProfile(Long id, UpdateProfileRequest request) {
        User user = getUserEntity(id);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        return UserProfileDto.fromEntity(userRepository.save(user));
    }
}