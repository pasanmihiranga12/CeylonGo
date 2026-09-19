package com.ceylonGo.destination.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.common.ResourceNotFoundException;
import com.ceylonGo.destination.dto.DestinationRequest;
import com.ceylonGo.destination.dto.DestinationResponse;
import com.ceylonGo.destination.model.Category;
import com.ceylonGo.destination.model.Destination;
import com.ceylonGo.destination.repository.CategoryRepository;
import com.ceylonGo.destination.repository.DestinationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final CategoryRepository categoryRepository;

    public DestinationService(DestinationRepository destinationRepository, CategoryRepository categoryRepository) {
        this.destinationRepository = destinationRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<DestinationResponse> search(String keyword, Long categoryId, String location, Pageable pageable) {
        return destinationRepository.search(
                blankToNull(keyword), categoryId, blankToNull(location), pageable
        ).map(DestinationResponse::fromEntity);
    }

    public DestinationResponse getById(Long id) {
        return DestinationResponse.fromEntity(getEntity(id));
    }

    public Destination getEntity(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
    }

    public DestinationResponse create(DestinationRequest request) {
        Destination destination = new Destination();
        applyRequest(destination, request);
        return DestinationResponse.fromEntity(destinationRepository.save(destination));
    }

    public DestinationResponse update(Long id, DestinationRequest request) {
        Destination destination = getEntity(id);
        applyRequest(destination, request);
        return DestinationResponse.fromEntity(destinationRepository.save(destination));
    }

    public void delete(Long id) {
        Destination destination = getEntity(id);
        destinationRepository.delete(destination);
    }

    private void applyRequest(Destination destination, DestinationRequest request) {
        destination.setName(request.getName());
        destination.setDescription(request.getDescription());
        destination.setLocation(request.getLocation());
        destination.setLatitude(request.getLatitude());
        destination.setLongitude(request.getLongitude());
        destination.setImageUrl(request.getImageUrl());
        destination.setOpeningHours(request.getOpeningHours());
        destination.setEntryFee(request.getEntryFee());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            destination.setCategory(category);
        }
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}