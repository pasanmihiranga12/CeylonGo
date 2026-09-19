package com.ceylonGo.guide.dto;

import com.ceylonGo.guide.model.GuideProfile;

public class GuideResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String profileImageUrl;
    private String bio;
    private String languages;
    private String specialities;
    private Integer experienceYears;
    private Double hourlyRate;
    private boolean verified;

    public static GuideResponse fromEntity(GuideProfile g) {
        GuideResponse dto = new GuideResponse();
        dto.id = g.getId();
        dto.userId = g.getUser().getId();
        dto.name = g.getUser().getName();
        dto.email = g.getUser().getEmail();
        dto.profileImageUrl = g.getUser().getProfileImageUrl();
        dto.bio = g.getBio();
        dto.languages = g.getLanguages();
        dto.specialities = g.getSpecialities();
        dto.experienceYears = g.getExperienceYears();
        dto.hourlyRate = g.getHourlyRate();
        dto.verified = g.isVerified();
        return dto;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public String getBio() { return bio; }
    public String getLanguages() { return languages; }
    public String getSpecialities() { return specialities; }
    public Integer getExperienceYears() { return experienceYears; }
    public Double getHourlyRate() { return hourlyRate; }
    public boolean isVerified() { return verified; }
}
