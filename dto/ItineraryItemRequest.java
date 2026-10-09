package com.ceylonGo.itinerary.dto;

public class ItineraryItemRequest {
    private Long destinationId;
    private Long guideId;
    private Integer dayNumber;
    private Integer orderIndex;
    private String activity;
    private String notes;

    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) { this.destinationId = destinationId; }
    public Long getGuideId() { return guideId; }
    public void setGuideId(Long guideId) { this.guideId = guideId; }
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
