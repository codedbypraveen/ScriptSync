package org.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseDTO {
    private Long id;

    @NotBlank(message = "Test case ID is required")
    private String testcaseId;

    @NotNull(message = "Module ID is required")
    private Long moduleId;
    private String moduleName;

    private Long subModuleId;
    private String subModuleName;

    @NotBlank(message = "Test case description is required")
    private String testCaseDescription;

    private String preConditions;

    @NotBlank(message = "Test script is required")
    private String testScript;

    @NotBlank(message = "Expected result is required")
    private String expectedResult;

    @NotNull(message = "Priority ID is required")
    private Long priorityId;
    private String priorityName;

    @NotNull(message = "Automation status ID is required")
    private Long automationStatusId;
    private String automationStatusName;

    private Long automatedById;
    private String automatedByName;

    private String automationComments;

    private String clubbedTcId;

    private List<Long> tagIds;
    private List<String> tagNames;
}

