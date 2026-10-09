package com.ceylonGo.itinerary.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public class ItineraryRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private Long packageId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numTravelers;
    private Double estimatedTotalCost;
    private String notes;
    private List<ItineraryItemRequest> items;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Integer getNumTravelers() { return numTravelers; }
    public void setNumTravelers(Integer numTravelers) { this.numTravelers = numTravelers; }
    public Double getEstimatedTotalCost() { return estimatedTotalCost; }
    public void setEstimatedTotalCost(Double estimatedTotalCost) { this.estimatedTotalCost = estimatedTotalCost; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<ItineraryItemRequest> getItems() { return items; }
    public void setItems(List<ItineraryItemRequest> items) { this.items = items; }
}
