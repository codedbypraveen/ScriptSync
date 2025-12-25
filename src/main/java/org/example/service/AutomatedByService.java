package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.AutomatedByDTO;
import org.example.exception.ResourceNotFoundException;
import org.example.model.AutomatedBy;
import org.example.repository.AutomatedByRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AutomatedByService {

    private final AutomatedByRepository automatedByRepository;

    public List<AutomatedByDTO> getAllAutomatedBy() {
        return automatedByRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AutomatedByDTO getAutomatedByById(Long id) {
        AutomatedBy automatedBy = automatedByRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AutomatedBy not found with id: " + id));
        return convertToDTO(automatedBy);
    }

    public AutomatedByDTO createAutomatedBy(AutomatedByDTO automatedByDTO) {
        AutomatedBy automatedBy = convertToEntity(automatedByDTO);
        AutomatedBy savedAutomatedBy = automatedByRepository.save(automatedBy);
        return convertToDTO(savedAutomatedBy);
    }

    public AutomatedByDTO updateAutomatedBy(Long id, AutomatedByDTO automatedByDTO) {
        AutomatedBy automatedBy = automatedByRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AutomatedBy not found with id: " + id));

        automatedBy.setName(automatedByDTO.getName());
        automatedBy.setEmail(automatedByDTO.getEmail());
        automatedBy.setTeam(automatedByDTO.getTeam());
        AutomatedBy updatedAutomatedBy = automatedByRepository.save(automatedBy);
        return convertToDTO(updatedAutomatedBy);
    }

    public void deleteAutomatedBy(Long id) {
        if (!automatedByRepository.existsById(id)) {
            throw new ResourceNotFoundException("AutomatedBy not found with id: " + id);
        }
        automatedByRepository.deleteById(id);
    }

    private AutomatedByDTO convertToDTO(AutomatedBy automatedBy) {
        AutomatedByDTO dto = new AutomatedByDTO();
        dto.setId(automatedBy.getId());
        dto.setName(automatedBy.getName());
        dto.setEmail(automatedBy.getEmail());
        dto.setTeam(automatedBy.getTeam());
        return dto;
    }

    private AutomatedBy convertToEntity(AutomatedByDTO dto) {
        AutomatedBy automatedBy = new AutomatedBy();
        automatedBy.setName(dto.getName());
        automatedBy.setEmail(dto.getEmail());
        automatedBy.setTeam(dto.getTeam());
        return automatedBy;
    }
}

