package com.ceylonGo.destination.dto;

import com.ceylonGo.destination.model.Destination;

public class DestinationResponse {
    private Long id;
    private String name;
    private String description;
    private CategoryDto category;
    private String location;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private String openingHours;
    private Double entryFee;
    private Double averageRating;
    private Integer reviewCount;

    public static DestinationResponse fromEntity(Destination d) {
        DestinationResponse dto = new DestinationResponse();
        dto.id = d.getId();
        dto.name = d.getName();
        dto.description = d.getDescription();
        dto.category = d.getCategory() != null ? CategoryDto.fromEntity(d.getCategory()) : null;
        dto.location = d.getLocation();
        dto.latitude = d.getLatitude();
        dto.longitude = d.getLongitude();
        dto.imageUrl = d.getImageUrl();
        dto.openingHours = d.getOpeningHours();
        dto.entryFee = d.getEntryFee();
        dto.averageRating = d.getAverageRating();
        dto.reviewCount = d.getReviewCount();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public CategoryDto getCategory() { return category; }
    public String getLocation() { return location; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getImageUrl() { return imageUrl; }
    public String getOpeningHours() { return openingHours; }
    public Double getEntryFee() { return entryFee; }
    public Double getAverageRating() { return averageRating; }
    public Integer getReviewCount() { return reviewCount; }
}
