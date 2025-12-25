package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.SubModuleDTO;
import org.example.exception.ResourceNotFoundException;
import org.example.model.Module;
import org.example.model.SubModule;
import org.example.repository.ModuleRepository;
import org.example.repository.SubModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SubModuleService {

    private final SubModuleRepository subModuleRepository;
    private final ModuleRepository moduleRepository;

    public List<SubModuleDTO> getAllSubModules() {
        return subModuleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SubModuleDTO> getSubModulesByModuleId(Long moduleId) {
        return subModuleRepository.findByModuleId(moduleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SubModuleDTO getSubModuleById(Long id) {
        SubModule subModule = subModuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubModule not found with id: " + id));
        return convertToDTO(subModule);
    }

    public SubModuleDTO createSubModule(SubModuleDTO subModuleDTO) {
        Module module = moduleRepository.findById(subModuleDTO.getModuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + subModuleDTO.getModuleId()));

        SubModule subModule = convertToEntity(subModuleDTO, module);
        SubModule savedSubModule = subModuleRepository.save(subModule);
        return convertToDTO(savedSubModule);
    }

    public SubModuleDTO updateSubModule(Long id, SubModuleDTO subModuleDTO) {
        SubModule subModule = subModuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubModule not found with id: " + id));

        Module module = moduleRepository.findById(subModuleDTO.getModuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + subModuleDTO.getModuleId()));

        subModule.setName(subModuleDTO.getName());
        subModule.setDescription(subModuleDTO.getDescription());
        subModule.setModule(module);
        SubModule updatedSubModule = subModuleRepository.save(subModule);
        return convertToDTO(updatedSubModule);
    }

    public void deleteSubModule(Long id) {
        if (!subModuleRepository.existsById(id)) {
            throw new ResourceNotFoundException("SubModule not found with id: " + id);
        }
        subModuleRepository.deleteById(id);
    }

    private SubModuleDTO convertToDTO(SubModule subModule) {
        SubModuleDTO dto = new SubModuleDTO();
        dto.setId(subModule.getId());
        dto.setName(subModule.getName());
        dto.setDescription(subModule.getDescription());
        dto.setModuleId(subModule.getModule().getId());
        dto.setModuleName(subModule.getModule().getName());
        return dto;
    }

    private SubModule convertToEntity(SubModuleDTO dto, Module module) {
        SubModule subModule = new SubModule();
        subModule.setName(dto.getName());
        subModule.setDescription(dto.getDescription());
        subModule.setModule(module);
        return subModule;
    }
}

