package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.AutomationStatusDTO;
import org.example.exception.DuplicateResourceException;
import org.example.exception.ResourceNotFoundException;
import org.example.model.AutomationStatus;
import org.example.repository.AutomationStatusRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AutomationStatusService {

    private final AutomationStatusRepository statusRepository;

    public List<AutomationStatusDTO> getAllStatuses() {
        return statusRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AutomationStatusDTO getStatusById(Long id) {
        AutomationStatus status = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Automation status not found with id: " + id));
        return convertToDTO(status);
    }

    public AutomationStatusDTO createStatus(AutomationStatusDTO statusDTO) {
        if (statusRepository.existsByName(statusDTO.getName())) {
            throw new DuplicateResourceException("Automation status already exists with name: " + statusDTO.getName());
        }
        AutomationStatus status = convertToEntity(statusDTO);
        AutomationStatus savedStatus = statusRepository.save(status);
        return convertToDTO(savedStatus);
    }

    public AutomationStatusDTO updateStatus(Long id, AutomationStatusDTO statusDTO) {
        AutomationStatus status = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Automation status not found with id: " + id));

        if (!status.getName().equals(statusDTO.getName()) &&
            statusRepository.existsByName(statusDTO.getName())) {
            throw new DuplicateResourceException("Automation status already exists with name: " + statusDTO.getName());
        }

        status.setName(statusDTO.getName());
        status.setDescription(statusDTO.getDescription());
        AutomationStatus updatedStatus = statusRepository.save(status);
        return convertToDTO(updatedStatus);
    }

    public void deleteStatus(Long id) {
        if (!statusRepository.existsById(id)) {
            throw new ResourceNotFoundException("Automation status not found with id: " + id);
        }
        statusRepository.deleteById(id);
    }

    private AutomationStatusDTO convertToDTO(AutomationStatus status) {
        AutomationStatusDTO dto = new AutomationStatusDTO();
        dto.setId(status.getId());
        dto.setName(status.getName());
        dto.setDescription(status.getDescription());
        return dto;
    }

    private AutomationStatus convertToEntity(AutomationStatusDTO dto) {
        AutomationStatus status = new AutomationStatus();
        status.setName(dto.getName());
        status.setDescription(dto.getDescription());
        return status;
    }
}

