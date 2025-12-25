package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.AutomatedByDTO;
import org.example.service.AutomatedByService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automated-by")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AutomatedByController {

    private final AutomatedByService automatedByService;

    @GetMapping
    public ResponseEntity<List<AutomatedByDTO>> getAllAutomatedBy() {
        return ResponseEntity.ok(automatedByService.getAllAutomatedBy());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutomatedByDTO> getAutomatedByById(@PathVariable Long id) {
        return ResponseEntity.ok(automatedByService.getAutomatedByById(id));
    }

    @PostMapping
    public ResponseEntity<AutomatedByDTO> createAutomatedBy(@Valid @RequestBody AutomatedByDTO automatedByDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(automatedByService.createAutomatedBy(automatedByDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AutomatedByDTO> updateAutomatedBy(@PathVariable Long id, @Valid @RequestBody AutomatedByDTO automatedByDTO) {
        return ResponseEntity.ok(automatedByService.updateAutomatedBy(id, automatedByDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAutomatedBy(@PathVariable Long id) {
        automatedByService.deleteAutomatedBy(id);
        return ResponseEntity.noContent().build();
    }
}


