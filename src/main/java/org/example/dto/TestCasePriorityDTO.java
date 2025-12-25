package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCasePriorityDTO {
    private Long id;

    @NotBlank(message = "Priority name is required")
    private String name;

    private String description;
    private Integer level;
}

