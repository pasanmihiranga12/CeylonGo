package com.ceylonGo.itinerary.dto;

import com.ceylonGo.itinerary.model.ItineraryItem;

public class ItineraryItemResponse {
    private Long id;
    private Long destinationId;
    private String destinationName;
    private String destinationImageUrl;
    private Long guideId;
    private String guideName;
    private Integer dayNumber;
    private Integer orderIndex;
    private String activity;
    private String notes;

    public static ItineraryItemResponse fromEntity(ItineraryItem item) {
        ItineraryItemResponse dto = new ItineraryItemResponse();
        dto.id = item.getId();
        if (item.getDestination() != null) {
            dto.destinationId = item.getDestination().getId();
            dto.destinationName = item.getDestination().getName();
            dto.destinationImageUrl = item.getDestination().getImageUrl();
        }
        if (item.getGuide() != null) {
            dto.guideId = item.getGuide().getId();
            dto.guideName = item.getGuide().getUser().getName();
        }
        dto.dayNumber = item.getDayNumber();
        dto.orderIndex = item.getOrderIndex();
        dto.activity = item.getActivity();
        dto.notes = item.getNotes();
        return dto;
    }

    public Long getId() { return id; }
    public Long getDestinationId() { return destinationId; }
    public String getDestinationName() { return destinationName; }
    public String getDestinationImageUrl() { return destinationImageUrl; }
    public Long getGuideId() { return guideId; }
    public String getGuideName() { return guideName; }
    public Integer getDayNumber() { return dayNumber; }
    public Integer getOrderIndex() { return orderIndex; }
    public String getActivity() { return activity; }
    public String getNotes() { return notes; }
}
