package com.ceylonGo.guide.repository;

import com.ceylonGo.guide.model.GuideProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GuideProfileRepository extends JpaRepository<GuideProfile, Long> {
    Optional<GuideProfile> findByUserId(Long userId);
    Page<GuideProfile> findByVerifiedTrue(Pageable pageable);
    Page<GuideProfile> findByLanguagesContainingIgnoreCase(String language, Pageable pageable);
}
