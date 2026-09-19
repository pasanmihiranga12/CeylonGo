package com.ceylonGo.guide.dto;

public class GuideProfileRequest {
    private String bio;
    private String languages;
    private String specialities;
    private Integer experienceYears;
    private Double hourlyRate;

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }
    public String getSpecialities() { return specialities; }
    public void setSpecialities(String specialities) { this.specialities = specialities; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
}
