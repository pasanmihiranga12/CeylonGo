package com.ceylonGo.config;

import com.ceylonGo.common.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Small helper so controllers/services don't need to repeat the
 * "pull the logged-in user off the SecurityContext" boilerplate.
 */
public class SecurityUtils {

    private SecurityUtils() {}

    public static CustomUserDetails currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails details)) {
            throw new UnauthorizedException("You must be logged in to perform this action");
        }
        return details;
    }

    public static Long currentUserId() {
        return currentUser().getId();
    }

    public static String currentUserRole() {
        return currentUser().getUser().getRole().name();
    }
}
