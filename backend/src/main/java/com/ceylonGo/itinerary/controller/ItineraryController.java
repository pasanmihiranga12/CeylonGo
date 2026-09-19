package com.ceylonGo.itinerary.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import com.ceylonGo.itinerary.dto.*;
import com.ceylonGo.itinerary.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** All endpoints here require login (see SecurityConfig) - itineraries are personal to each tourist. */
@RestController
@RequestMapping("/api/itineraries")
public class ItineraryController {

    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @GetMapping
    public ApiResponse<List<ItineraryResponse>> getMyItineraries() {
        return ApiResponse.ok(itineraryService.getMyItineraries(SecurityUtils.currentUserId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<ItineraryResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(itineraryService.getById(id, SecurityUtils.currentUserId()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ItineraryResponse>> create(@Valid @RequestBody ItineraryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Itinerary created", itineraryService.create(SecurityUtils.currentUserId(), request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<ItineraryResponse> update(@PathVariable Long id, @Valid @RequestBody ItineraryRequest request) {
        return ApiResponse.ok("Itinerary updated", itineraryService.update(id, SecurityUtils.currentUserId(), request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        itineraryService.delete(id, SecurityUtils.currentUserId());
        return ApiResponse.ok("Itinerary deleted", null);
    }

    @PostMapping("/{id}/items")
    public ApiResponse<ItineraryResponse> addItem(@PathVariable Long id, @RequestBody ItineraryItemRequest request) {
        return ApiResponse.ok("Item added", itineraryService.addItem(id, SecurityUtils.currentUserId(), request));
    }

    @PutMapping("/{id}/items/{itemId}")
    public ApiResponse<ItineraryResponse> updateItem(@PathVariable Long id, @PathVariable Long itemId,
                                                       @RequestBody ItineraryItemRequest request) {
        return ApiResponse.ok("Item updated", itineraryService.updateItem(id, itemId, SecurityUtils.currentUserId(), request));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ApiResponse<ItineraryResponse> removeItem(@PathVariable Long id, @PathVariable Long itemId) {
        return ApiResponse.ok("Item removed", itineraryService.removeItem(id, itemId, SecurityUtils.currentUserId()));
    }

    @PutMapping("/{id}/reorder")
    public ApiResponse<ItineraryResponse> reorder(@PathVariable Long id, @RequestBody ReorderRequest request) {
        return ApiResponse.ok("Itinerary reordered", itineraryService.reorderItems(id, SecurityUtils.currentUserId(), request));
    }
}
