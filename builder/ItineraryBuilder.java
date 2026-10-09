package com.ceylonGo.itinerary.builder;

import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.destination.service.DestinationService;
import com.ceylonGo.guide.service.GuideService;
import com.ceylonGo.itinerary.dto.ItineraryItemRequest;
import com.ceylonGo.itinerary.model.Itinerary;
import com.ceylonGo.itinerary.model.ItineraryItem;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Builder pattern for assembling an {@link Itinerary} and its {@link ItineraryItem}s
 * step by step, instead of constructing the entity ad hoc inside {@code ItineraryService}.
 * Mirrors what {@code CustomPackageBuilder.jsx} already does conceptually on the frontend.
 *
 * Usage:
 * <pre>
 *   Itinerary itinerary = new ItineraryBuilder(userService, destinationService, guideService)
 *           .forUser(userId)
 *           .withTitle("My trip")
 *           .withDates(start, end)
 *           .withTravelerCount(2)
 *           .addStop(itemRequest)
 *           .build();
 * </pre>
 */
public class ItineraryBuilder {

    private final UserService userService;
    private final DestinationService destinationService;
    private final GuideService guideService;

    private User user;
    private Long packageId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numTravelers = 1;
    private Double estimatedTotalCost = 0.0;
    private String notes;
    private final List<ItineraryItemRequest> stops = new ArrayList<>();

    public ItineraryBuilder(UserService userService, DestinationService destinationService, GuideService guideService) {
        this.userService = userService;
        this.destinationService = destinationService;
        this.guideService = guideService;
    }

    public ItineraryBuilder forUser(Long userId) {
        this.user = userService.getUserEntity(userId);
        return this;
    }

    public ItineraryBuilder forUser(User user) {
        this.user = user;
        return this;
    }

    public ItineraryBuilder withPackageId(Long packageId) {
        this.packageId = packageId;
        return this;
    }

    public ItineraryBuilder withTitle(String title) {
        this.title = title;
        return this;
    }

    public ItineraryBuilder withDates(LocalDate startDate, LocalDate endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        return this;
    }

    public ItineraryBuilder withTravelerCount(Integer numTravelers) {
        this.numTravelers = numTravelers != null ? Math.max(1, numTravelers) : 1;
        return this;
    }

    public ItineraryBuilder withEstimatedTotalCost(Double estimatedTotalCost) {
        this.estimatedTotalCost = estimatedTotalCost != null ? estimatedTotalCost : 0.0;
        return this;
    }

    public ItineraryBuilder withNotes(String notes) {
        this.notes = notes;
        return this;
    }

    public ItineraryBuilder addStop(ItineraryItemRequest itemRequest) {
        if (itemRequest != null) {
            this.stops.add(itemRequest);
        }
        return this;
    }

    public ItineraryBuilder addStops(List<ItineraryItemRequest> itemRequests) {
        if (itemRequests != null) {
            this.stops.addAll(itemRequests);
        }
        return this;
    }

    public Itinerary build() {
        Itinerary itinerary = new Itinerary();
        itinerary.setUser(user);
        itinerary.setPackageId(packageId);
        itinerary.setTitle(title);
        itinerary.setStartDate(startDate);
        itinerary.setEndDate(endDate);
        itinerary.setNumTravelers(numTravelers != null ? Math.max(1, numTravelers) : 1);
        itinerary.setEstimatedTotalCost(estimatedTotalCost != null ? estimatedTotalCost : 0.0);
        itinerary.setNotes(notes);

        int fallbackOrder = 0;
        for (ItineraryItemRequest itemRequest : stops) {
            ItineraryItem item = new ItineraryItem();
            item.setItinerary(itinerary);
            if (itemRequest.getDestinationId() != null) {
                item.setDestination(destinationService.getEntity(itemRequest.getDestinationId()));
            }
            if (itemRequest.getGuideId() != null) {
                item.setGuide(guideService.getGuideEntity(itemRequest.getGuideId()));
            }
            item.setDayNumber(itemRequest.getDayNumber());
            item.setOrderIndex(itemRequest.getOrderIndex() != null ? itemRequest.getOrderIndex() : fallbackOrder);
            item.setActivity(itemRequest.getActivity());
            item.setNotes(itemRequest.getNotes());
            itinerary.getItems().add(item);
            fallbackOrder++;
        }

        return itinerary;
    }
}
