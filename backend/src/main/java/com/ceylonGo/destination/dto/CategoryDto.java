package com.ceylonGo.destination.dto;

import com.ceylonGo.destination.model.Category;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;

    public static CategoryDto fromEntity(Category c) {
        CategoryDto dto = new CategoryDto();
        dto.id = c.getId();
        dto.name = c.getName();
        dto.description = c.getDescription();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
}
