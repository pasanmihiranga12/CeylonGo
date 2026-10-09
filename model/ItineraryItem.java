package com.ceylonGo.itinerary.model;

import com.ceylonGo.destination.model.Destination;
import com.ceylonGo.guide.model.GuideProfile;
import jakarta.persistence.*;

@Entity
@Table(name = "itinerary_items")
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;

    // Optional: attach a guide to this itinerary stop/activity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id")
    private GuideProfile guide;

    @Column(name = "day_number")
    private Integer dayNumber;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(length = 500)
    private String activity; // free-text activity note, e.g. "Sunrise hike"

    @Column(length = 1000)
    private String notes;

    public Long getId() { return id; }
    public Itinerary getItinerary() { return itinerary; }
    public void setItinerary(Itinerary itinerary) { this.itinerary = itinerary; }
    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }
    public GuideProfile getGuide() { return guide; }
    public void setGuide(GuideProfile guide) { this.guide = guide; }
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
