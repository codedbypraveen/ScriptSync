package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.TestCasePriorityDTO;
import org.example.exception.DuplicateResourceException;
import org.example.exception.ResourceNotFoundException;
import org.example.model.TestCasePriority;
import org.example.repository.TestCasePriorityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TestCasePriorityService {

    private final TestCasePriorityRepository priorityRepository;

    public List<TestCasePriorityDTO> getAllPriorities() {
        return priorityRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TestCasePriorityDTO getPriorityById(Long id) {
        TestCasePriority priority = priorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priority not found with id: " + id));
        return convertToDTO(priority);
    }

    public TestCasePriorityDTO createPriority(TestCasePriorityDTO priorityDTO) {
        if (priorityRepository.existsByName(priorityDTO.getName())) {
            throw new DuplicateResourceException("Priority already exists with name: " + priorityDTO.getName());
        }
        TestCasePriority priority = convertToEntity(priorityDTO);
        TestCasePriority savedPriority = priorityRepository.save(priority);
        return convertToDTO(savedPriority);
    }

    public TestCasePriorityDTO updatePriority(Long id, TestCasePriorityDTO priorityDTO) {
        TestCasePriority priority = priorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priority not found with id: " + id));

        if (!priority.getName().equals(priorityDTO.getName()) &&
            priorityRepository.existsByName(priorityDTO.getName())) {
            throw new DuplicateResourceException("Priority already exists with name: " + priorityDTO.getName());
        }

        priority.setName(priorityDTO.getName());
        priority.setDescription(priorityDTO.getDescription());
        priority.setLevel(priorityDTO.getLevel());
        TestCasePriority updatedPriority = priorityRepository.save(priority);
        return convertToDTO(updatedPriority);
    }

    public void deletePriority(Long id) {
        if (!priorityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Priority not found with id: " + id);
        }
        priorityRepository.deleteById(id);
    }

    private TestCasePriorityDTO convertToDTO(TestCasePriority priority) {
        TestCasePriorityDTO dto = new TestCasePriorityDTO();
        dto.setId(priority.getId());
        dto.setName(priority.getName());
        dto.setDescription(priority.getDescription());
        dto.setLevel(priority.getLevel());
        return dto;
    }

    private TestCasePriority convertToEntity(TestCasePriorityDTO dto) {
        TestCasePriority priority = new TestCasePriority();
        priority.setName(dto.getName());
        priority.setDescription(dto.getDescription());
        priority.setLevel(dto.getLevel());
        return priority;
    }
}

