package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.TestCasePriorityDTO;
import org.example.service.TestCasePriorityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/priorities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestCasePriorityController {

    private final TestCasePriorityService priorityService;

    @GetMapping
    public ResponseEntity<List<TestCasePriorityDTO>> getAllPriorities() {
        return ResponseEntity.ok(priorityService.getAllPriorities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestCasePriorityDTO> getPriorityById(@PathVariable Long id) {
        return ResponseEntity.ok(priorityService.getPriorityById(id));
    }

    @PostMapping
    public ResponseEntity<TestCasePriorityDTO> createPriority(@Valid @RequestBody TestCasePriorityDTO priorityDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(priorityService.createPriority(priorityDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestCasePriorityDTO> updatePriority(@PathVariable Long id, @Valid @RequestBody TestCasePriorityDTO priorityDTO) {
        return ResponseEntity.ok(priorityService.updatePriority(id, priorityDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePriority(@PathVariable Long id) {
        priorityService.deletePriority(id);
        return ResponseEntity.noContent().build();
    }
}

