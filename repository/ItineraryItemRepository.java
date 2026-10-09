package com.ceylonGo.itinerary.repository;

import com.ceylonGo.itinerary.model.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
}
