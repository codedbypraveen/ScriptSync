package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutomationStatusDTO {
    private Long id;

    @NotBlank(message = "Status name is required")
    private String name;

    private String description;
}

