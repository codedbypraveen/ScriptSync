package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.ModuleDTO;
import org.example.exception.DuplicateResourceException;
import org.example.exception.ResourceNotFoundException;
import org.example.model.Module;
import org.example.repository.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ModuleDTO getModuleById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + id));
        return convertToDTO(module);
    }

    public ModuleDTO createModule(ModuleDTO moduleDTO) {
        if (moduleRepository.existsByName(moduleDTO.getName())) {
            throw new DuplicateResourceException("Module already exists with name: " + moduleDTO.getName());
        }
        Module module = convertToEntity(moduleDTO);
        Module savedModule = moduleRepository.save(module);
        return convertToDTO(savedModule);
    }

    public ModuleDTO updateModule(Long id, ModuleDTO moduleDTO) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + id));

        if (!module.getName().equals(moduleDTO.getName()) &&
            moduleRepository.existsByName(moduleDTO.getName())) {
            throw new DuplicateResourceException("Module already exists with name: " + moduleDTO.getName());
        }

        module.setName(moduleDTO.getName());
        module.setDescription(moduleDTO.getDescription());
        Module updatedModule = moduleRepository.save(module);
        return convertToDTO(updatedModule);
    }

    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Module not found with id: " + id);
        }
        moduleRepository.deleteById(id);
    }

    private ModuleDTO convertToDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setName(module.getName());
        dto.setDescription(module.getDescription());
        return dto;
    }

    private Module convertToEntity(ModuleDTO dto) {
        Module module = new Module();
        module.setName(dto.getName());
        module.setDescription(dto.getDescription());
        return module;
    }
}

