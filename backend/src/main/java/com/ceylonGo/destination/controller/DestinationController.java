package com.ceylonGo.destination.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.destination.dto.DestinationRequest;
import com.ceylonGo.destination.dto.DestinationResponse;
import com.ceylonGo.destination.service.DestinationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * GET endpoints are public (destination discovery should work for
 * unauthenticated visitors). Create/update/delete are admin-only -
 * see SecurityConfig.
 */
@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ApiResponse<Page<DestinationResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return ApiResponse.ok(destinationService.search(keyword, categoryId, location, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<DestinationResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(destinationService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DestinationResponse>> create(@Valid @RequestBody DestinationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Destination created", destinationService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DestinationResponse> update(@PathVariable Long id, @Valid @RequestBody DestinationRequest request) {
        return ApiResponse.ok("Destination updated", destinationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        destinationService.delete(id);
        return ApiResponse.ok("Destination deleted", null);
    }
}
