package com.ceylonGo.itinerary.dto;

import com.ceylonGo.itinerary.model.Itinerary;

import java.time.LocalDate;
import java.util.List;

public class ItineraryResponse {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private List<ItineraryItemResponse> items;

    public static ItineraryResponse fromEntity(Itinerary itinerary) {
        ItineraryResponse dto = new ItineraryResponse();
        dto.id = itinerary.getId();
        dto.title = itinerary.getTitle();
        dto.startDate = itinerary.getStartDate();
        dto.endDate = itinerary.getEndDate();
        dto.notes = itinerary.getNotes();
        dto.items = itinerary.getItems().stream().map(ItineraryItemResponse::fromEntity).toList();
        return dto;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getNotes() { return notes; }
    public List<ItineraryItemResponse> getItems() { return items; }
}
