package com.ceylonGo.itinerary.dto;

import com.ceylonGo.itinerary.model.Itinerary;
import java.time.LocalDate;
import java.util.List;

public class ItineraryResponse {
    private Long id;
    private Long packageId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numTravelers;
    private Double estimatedTotalCost;
    private String notes;
    private List<ItineraryItemResponse> items;

    public static ItineraryResponse fromEntity(Itinerary itinerary) {
        ItineraryResponse dto = new ItineraryResponse();
        dto.id = itinerary.getId();
        dto.packageId = itinerary.getPackageId();
        dto.title = itinerary.getTitle();
        dto.startDate = itinerary.getStartDate();
        dto.endDate = itinerary.getEndDate();
        dto.numTravelers = itinerary.getNumTravelers();
        dto.estimatedTotalCost = itinerary.getEstimatedTotalCost();
        dto.notes = itinerary.getNotes();
        dto.items = itinerary.getItems().stream().map(ItineraryItemResponse::fromEntity).toList();
        return dto;
    }

    public Long getId() { return id; }
    public Long getPackageId() { return packageId; }
    public String getTitle() { return title; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Integer getNumTravelers() { return numTravelers; }
    public Double getEstimatedTotalCost() { return estimatedTotalCost; }
    public String getNotes() { return notes; }
    public List<ItineraryItemResponse> getItems() { return items; }
}
