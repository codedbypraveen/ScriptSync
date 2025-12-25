package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.SubModuleDTO;
import org.example.service.SubModuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submodules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubModuleController {

    private final SubModuleService subModuleService;

    @GetMapping
    public ResponseEntity<List<SubModuleDTO>> getAllSubModules() {
        return ResponseEntity.ok(subModuleService.getAllSubModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubModuleDTO> getSubModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(subModuleService.getSubModuleById(id));
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<SubModuleDTO>> getSubModulesByModuleId(@PathVariable Long moduleId) {
        return ResponseEntity.ok(subModuleService.getSubModulesByModuleId(moduleId));
    }

    @PostMapping
    public ResponseEntity<SubModuleDTO> createSubModule(@Valid @RequestBody SubModuleDTO subModuleDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subModuleService.createSubModule(subModuleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubModuleDTO> updateSubModule(@PathVariable Long id, @Valid @RequestBody SubModuleDTO subModuleDTO) {
        return ResponseEntity.ok(subModuleService.updateSubModule(id, subModuleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubModule(@PathVariable Long id) {
        subModuleService.deleteSubModule(id);
        return ResponseEntity.noContent().build();
    }
}

