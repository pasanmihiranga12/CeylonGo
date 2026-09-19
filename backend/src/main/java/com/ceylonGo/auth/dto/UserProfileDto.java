package com.ceylonGo.auth.dto;

import com.ceylonGo.auth.model.Role;
import com.ceylonGo.auth.model.User;

public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String profileImageUrl;

    public static UserProfileDto fromEntity(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.phone = user.getPhone();
        dto.role = user.getRole();
        dto.profileImageUrl = user.getProfileImageUrl();
        return dto;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Role getRole() { return role; }
    public String getProfileImageUrl() { return profileImageUrl; }
}
