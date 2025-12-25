package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubModuleDTO {
    private Long id;

    @NotBlank(message = "Sub-module name is required")
    private String name;

    private String description;

    @NotNull(message = "Module ID is required")
    private Long moduleId;

    private String moduleName;
}

