package org.example.repository;

import org.example.model.AutomationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AutomationStatusRepository extends JpaRepository<AutomationStatus, Long> {
    Optional<AutomationStatus> findByName(String name);
    boolean existsByName(String name);
}

