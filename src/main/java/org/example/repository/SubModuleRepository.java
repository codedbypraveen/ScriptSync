package org.example.repository;

import org.example.model.SubModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubModuleRepository extends JpaRepository<SubModule, Long> {
    List<SubModule> findByModuleId(Long moduleId);
}

