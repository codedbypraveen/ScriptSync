package org.example.repository;

import org.example.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    Optional<TestCase> findByTestcaseId(String testcaseId);
    boolean existsByTestcaseId(String testcaseId);
    List<TestCase> findByModuleId(Long moduleId);
    List<TestCase> findBySubModuleId(Long subModuleId);
    List<TestCase> findByAutomationStatusId(Long automationStatusId);
    List<TestCase> findByPriorityId(Long priorityId);

    @Query("SELECT t FROM TestCase t JOIN t.tags tag WHERE tag.id = :tagId")
    List<TestCase> findByTagId(Long tagId);
}

