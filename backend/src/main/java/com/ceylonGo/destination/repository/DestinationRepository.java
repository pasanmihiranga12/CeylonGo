package com.ceylonGo.destination.repository;

import com.ceylonGo.destination.model.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query("""
           SELECT d FROM Destination d
           WHERE (:keyword IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                                   OR LOWER(d.location) LIKE LOWER(CONCAT('%', :keyword, '%')))
             AND (:categoryId IS NULL OR d.category.id = :categoryId)
             AND (:location IS NULL OR LOWER(d.location) LIKE LOWER(CONCAT('%', :location, '%')))
           """)
    Page<Destination> search(@Param("keyword") String keyword,
                              @Param("categoryId") Long categoryId,
                              @Param("location") String location,
                              Pageable pageable);
}
