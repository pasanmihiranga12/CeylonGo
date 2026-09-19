package com.ceylonGo.itinerary.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.common.BadRequestException;
import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.destination.model.Destination;
import com.ceylonGo.destination.service.DestinationService;
import com.ceylonGo.guide.model.GuideProfile;
import com.ceylonGo.guide.service.GuideService;
import com.ceylonGo.itinerary.dto.*;
import com.ceylonGo.itinerary.model.Itinerary;
import com.ceylonGo.itinerary.model.ItineraryItem;
import com.ceylonGo.itinerary.repository.ItineraryItemRepository;
import com.ceylonGo.itinerary.repository.ItineraryRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final ItineraryItemRepository itineraryItemRepository;
    private final UserService userService;
    private final DestinationService destinationService;
    private final GuideService guideService;

    public ItineraryService(ItineraryRepository itineraryRepository,
                            ItineraryItemRepository itineraryItemRepository,
                            UserService userService,
                            DestinationService destinationService,
                            GuideService guideService) {
        this.itineraryRepository = itineraryRepository;
        this.itineraryItemRepository = itineraryItemRepository;
        this.userService = userService;
        this.destinationService = destinationService;
        this.guideService = guideService;
    }

    public List<ItineraryResponse> getMyItineraries(Long userId) {
        return itineraryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(ItineraryResponse::fromEntity).toList();
    }

    public ItineraryResponse getById(Long id, Long userId) {
        return ItineraryResponse.fromEntity(getOwnedEntity(id, userId));
    }

    public ItineraryResponse create(Long userId, ItineraryRequest request) {
        User user = userService.getUserEntity(userId);

        Itinerary itinerary = new Itinerary();
        itinerary.setUser(user);
        itinerary.setTitle(request.getTitle());
        itinerary.setStartDate(request.getStartDate());
        itinerary.setEndDate(request.getEndDate());
        itinerary.setNotes(request.getNotes());

        return ItineraryResponse.fromEntity(itineraryRepository.save(itinerary));
    }

    public ItineraryResponse update(Long id, Long userId, ItineraryRequest request) {
        Itinerary itinerary = getOwnedEntity(id, userId);
        itinerary.setTitle(request.getTitle());
        itinerary.setStartDate(request.getStartDate());
        itinerary.setEndDate(request.getEndDate());
        itinerary.setNotes(request.getNotes());
        return ItineraryResponse.fromEntity(itineraryRepository.save(itinerary));
    }

    public void delete(Long id, Long userId) {
        Itinerary itinerary = getOwnedEntity(id, userId);
        itineraryRepository.delete(itinerary);
    }

    public ItineraryResponse addItem(Long itineraryId, Long userId, ItineraryItemRequest request) {
        Itinerary itinerary = getOwnedEntity(itineraryId, userId);

        ItineraryItem item = new ItineraryItem();
        item.setItinerary(itinerary);

        if (request.getDestinationId() != null) {
            Destination destination = destinationService.getEntity(request.getDestinationId());
            item.setDestination(destination);
        }
        if (request.getGuideId() != null) {
            GuideProfile guide = guideService.getGuideEntity(request.getGuideId());
            item.setGuide(guide);
        }
        item.setDayNumber(request.getDayNumber());
        item.setActivity(request.getActivity());
        item.setNotes(request.getNotes());
        item.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : itinerary.getItems().size());

        itinerary.getItems().add(item);
        return ItineraryResponse.fromEntity(itineraryRepository.save(itinerary));
    }

    public ItineraryResponse updateItem(Long itineraryId, Long itemId, Long userId, ItineraryItemRequest request) {
        Itinerary itinerary = getOwnedEntity(itineraryId, userId);
        ItineraryItem item = itinerary.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        if (request.getDestinationId() != null) {
            item.setDestination(destinationService.getEntity(request.getDestinationId()));
        }
        if (request.getGuideId() != null) {
            item.setGuide(guideService.getGuideEntity(request.getGuideId()));
        }
        if (request.getDayNumber() != null) item.setDayNumber(request.getDayNumber());
        if (request.getActivity() != null) item.setActivity(request.getActivity());
        if (request.getNotes() != null) item.setNotes(request.getNotes());
        if (request.getOrderIndex() != null) item.setOrderIndex(request.getOrderIndex());

        return ItineraryResponse.fromEntity(itineraryRepository.save(itinerary));
    }

    public ItineraryResponse removeItem(Long itineraryId, Long itemId, Long userId) {
        Itinerary itinerary = getOwnedEntity(itineraryId, userId);
        boolean removed = itinerary.getItems().removeIf(i -> i.getId().equals(itemId));
        if (!removed) {
            throw new ResourceNotFoundException("Itinerary item not found");
        }
        return ItineraryResponse.fromEntity(itineraryRepository.save(itinerary));
    }

    /** Reorders items given a full ordered list of item IDs belonging to this itinerary. */
    public ItineraryResponse reorderItems(Long itineraryId, Long userId, ReorderRequest request) {
        Itinerary itinerary = getOwnedEntity(itineraryId, userId);

        Map<Long, ItineraryItem> itemsById = new HashMap<>();
        itinerary.getItems().forEach(item -> itemsById.put(item.getId(), item));

        List<Long> order = request.getItemIdsInOrder();
        if (order == null || order.size() != itemsById.size()) {
            throw new BadRequestException("The reorder list must include every item in the itinerary exactly once");
        }

        for (int i = 0; i < order.size(); i++) {
            ItineraryItem item = itemsById.get(order.get(i));
            if (item == null) {
                throw new BadRequestException("Unknown itinerary item id: " + order.get(i));
            }
            item.setOrderIndex(i);
        }

        return ItineraryResponse.fromEntity(itineraryRepository.save(itinerary));
    }

    private Itinerary getOwnedEntity(Long id, Long userId) {
        Itinerary itinerary = itineraryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary not found with id: " + id));

        if (!itinerary.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have access to this itinerary");
        }
        return itinerary;
    }
}