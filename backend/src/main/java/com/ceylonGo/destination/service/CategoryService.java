package com.ceylonGo.destination.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.destination.dto.CategoryDto;
import com.ceylonGo.destination.model.Category;
import com.ceylonGo.destination.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> listAll() {
        return categoryRepository.findAll().stream().map(CategoryDto::fromEntity).toList();
    }

    public Category createOrGet(String name) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    return categoryRepository.save(c);
                });
    }
}