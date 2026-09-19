package com.ceylonGo.guide.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.auth.model.Role;
import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.common.BadRequestException;
import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.guide.dto.GuideProfileRequest;
import com.ceylonGo.guide.dto.GuideResponse;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.repository.GuideProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class GuideService {

    private final GuideProfileRepository guideProfileRepository;
    private final UserService userService;

    public GuideService(GuideProfileRepository guideProfileRepository, UserService userService) {
        this.guideProfileRepository = guideProfileRepository;
        this.userService = userService;
    }

    public Page<GuideResponse> listVerifiedGuides(Pageable pageable) {
        return guideProfileRepository.findByVerifiedTrue(pageable).map(GuideResponse::fromEntity);
    }

    public Page<GuideResponse> searchByLanguage(String language, Pageable pageable) {
        return guideProfileRepository.findByLanguagesContainingIgnoreCase(language, pageable)
                .map(GuideResponse::fromEntity);
    }

    public GuideResponse getGuideById(Long id) {
        return GuideResponse.fromEntity(getGuideEntity(id));
    }

    public GuideProfile getGuideEntity(Long id) {
        return guideProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found with id: " + id));
    }

    /** Creates or updates the calling user's own guide profile. */
    public GuideResponse upsertMyProfile(Long userId, GuideProfileRequest request) {
        User user = userService.getUserEntity(userId);
        if (user.getRole() != Role.GUIDE) {
            throw new BadRequestException("Only users registered as a GUIDE can create a guide profile");
        }

        GuideProfile profile = guideProfileRepository.findByUserId(userId).orElseGet(() -> {
            GuideProfile p = new GuideProfile();
            p.setUser(user);
            return p;
        });

        profile.setBio(request.getBio());
        profile.setLanguages(request.getLanguages());
        profile.setSpecialities(request.getSpecialities());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setHourlyRate(request.getHourlyRate());

        return GuideResponse.fromEntity(guideProfileRepository.save(profile));
    }

    public GuideResponse getMyProfile(Long userId) {
        GuideProfile profile = guideProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("You have not created a guide profile yet"));
        return GuideResponse.fromEntity(profile);
    }
}