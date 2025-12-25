package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.AutomationStatusDTO;
import org.example.service.AutomationStatusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automation-statuses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AutomationStatusController {

    private final AutomationStatusService statusService;

    @GetMapping
    public ResponseEntity<List<AutomationStatusDTO>> getAllStatuses() {
        return ResponseEntity.ok(statusService.getAllStatuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutomationStatusDTO> getStatusById(@PathVariable Long id) {
        return ResponseEntity.ok(statusService.getStatusById(id));
    }

    @PostMapping
    public ResponseEntity<AutomationStatusDTO> createStatus(@Valid @RequestBody AutomationStatusDTO statusDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(statusService.createStatus(statusDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AutomationStatusDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody AutomationStatusDTO statusDTO) {
        return ResponseEntity.ok(statusService.updateStatus(id, statusDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Long id) {
        statusService.deleteStatus(id);
        return ResponseEntity.noContent().build();
    }
}

