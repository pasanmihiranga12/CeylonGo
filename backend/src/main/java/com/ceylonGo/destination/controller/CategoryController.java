package com.ceylonGo.destination.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.destination.dto.CategoryDto;
import com.ceylonGo.destination.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<List<CategoryDto>> listCategories() {
        return ApiResponse.ok(categoryService.listAll());
    }
}
