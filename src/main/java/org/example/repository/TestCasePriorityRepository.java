package org.example.repository;

import org.example.model.TestCasePriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestCasePriorityRepository extends JpaRepository<TestCasePriority, Long> {
    Optional<TestCasePriority> findByName(String name);
    boolean existsByName(String name);
}

