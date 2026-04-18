package com.example.backend.repositories;

import com.example.backend.models.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    List<Site> findByOwnerId(Long ownerId);
    Optional<Site> findBySubdomain(String subdomain);
}
