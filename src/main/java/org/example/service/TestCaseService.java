package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.TestCaseDTO;
import org.example.exception.DuplicateResourceException;
import org.example.exception.ResourceNotFoundException;
import org.example.model.AutomatedBy;
import org.example.model.AutomationStatus;
import org.example.model.Module;
import org.example.model.SubModule;
import org.example.model.Tag;
import org.example.model.TestCase;
import org.example.model.TestCasePriority;
import org.example.repository.AutomatedByRepository;
import org.example.repository.AutomationStatusRepository;
import org.example.repository.ModuleRepository;
import org.example.repository.SubModuleRepository;
import org.example.repository.TagRepository;
import org.example.repository.TestCaseRepository;
import org.example.repository.TestCasePriorityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ModuleRepository moduleRepository;
    private final SubModuleRepository subModuleRepository;
    private final TestCasePriorityRepository priorityRepository;
    private final AutomationStatusRepository statusRepository;
    private final AutomatedByRepository automatedByRepository;
    private final TagRepository tagRepository;

    public List<TestCaseDTO> getAllTestCases() {
        return testCaseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TestCaseDTO getTestCaseById(Long id) {
        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found with id: " + id));
        return convertToDTO(testCase);
    }

    public List<TestCaseDTO> getTestCasesByModuleId(Long moduleId) {
        return testCaseRepository.findByModuleId(moduleId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TestCaseDTO createTestCase(TestCaseDTO testCaseDTO) {
        if (testCaseRepository.existsByTestcaseId(testCaseDTO.getTestcaseId())) {
            throw new DuplicateResourceException("TestCase already exists with testcaseId: " + testCaseDTO.getTestcaseId());
        }

        TestCase testCase = convertToEntity(testCaseDTO);
        TestCase savedTestCase = testCaseRepository.save(testCase);
        return convertToDTO(savedTestCase);
    }

    public TestCaseDTO updateTestCase(Long id, TestCaseDTO testCaseDTO) {
        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase not found with id: " + id));

        if (!testCase.getTestcaseId().equals(testCaseDTO.getTestcaseId()) &&
            testCaseRepository.existsByTestcaseId(testCaseDTO.getTestcaseId())) {
            throw new DuplicateResourceException("TestCase already exists with testcaseId: " + testCaseDTO.getTestcaseId());
        }

        updateTestCaseFromDTO(testCase, testCaseDTO);
        TestCase updatedTestCase = testCaseRepository.save(testCase);
        return convertToDTO(updatedTestCase);
    }

    public void deleteTestCase(Long id) {
        if (!testCaseRepository.existsById(id)) {
            throw new ResourceNotFoundException("TestCase not found with id: " + id);
        }
        testCaseRepository.deleteById(id);
    }

    private TestCaseDTO convertToDTO(TestCase testCase) {
        TestCaseDTO dto = new TestCaseDTO();
        dto.setId(testCase.getId());
        dto.setTestcaseId(testCase.getTestcaseId());
        dto.setModuleId(testCase.getModule().getId());
        dto.setModuleName(testCase.getModule().getName());

        if (testCase.getSubModule() != null) {
            dto.setSubModuleId(testCase.getSubModule().getId());
            dto.setSubModuleName(testCase.getSubModule().getName());
        }

        dto.setTestCaseDescription(testCase.getTestCaseDescription());
        dto.setPreConditions(testCase.getPreConditions());
        dto.setTestScript(testCase.getTestScript());
        dto.setExpectedResult(testCase.getExpectedResult());
        dto.setPriorityId(testCase.getPriority().getId());
        dto.setPriorityName(testCase.getPriority().getName());
        dto.setAutomationStatusId(testCase.getAutomationStatus().getId());
        dto.setAutomationStatusName(testCase.getAutomationStatus().getName());

        if (testCase.getAutomatedBy() != null) {
            dto.setAutomatedById(testCase.getAutomatedBy().getId());
            dto.setAutomatedByName(testCase.getAutomatedBy().getName());
        }

        dto.setAutomationComments(testCase.getAutomationComments());
        dto.setClubbedTcId(testCase.getClubbedTcId());

        if (testCase.getTags() != null && !testCase.getTags().isEmpty()) {
            dto.setTagIds(testCase.getTags().stream()
                    .map(Tag::getId)
                    .collect(Collectors.toList()));
            dto.setTagNames(testCase.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private TestCase convertToEntity(TestCaseDTO dto) {
        TestCase testCase = new TestCase();
        updateTestCaseFromDTO(testCase, dto);
        return testCase;
    }

    private void updateTestCaseFromDTO(TestCase testCase, TestCaseDTO dto) {
        testCase.setTestcaseId(dto.getTestcaseId());

        Module module = moduleRepository.findById(dto.getModuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with id: " + dto.getModuleId()));
        testCase.setModule(module);

        if (dto.getSubModuleId() != null) {
            SubModule subModule = subModuleRepository.findById(dto.getSubModuleId())
                    .orElseThrow(() -> new ResourceNotFoundException("SubModule not found with id: " + dto.getSubModuleId()));
            testCase.setSubModule(subModule);
        } else {
            testCase.setSubModule(null);
        }

        testCase.setTestCaseDescription(dto.getTestCaseDescription());
        testCase.setPreConditions(dto.getPreConditions());
        testCase.setTestScript(dto.getTestScript());
        testCase.setExpectedResult(dto.getExpectedResult());

        TestCasePriority priority = priorityRepository.findById(dto.getPriorityId())
                .orElseThrow(() -> new ResourceNotFoundException("Priority not found with id: " + dto.getPriorityId()));
        testCase.setPriority(priority);

        AutomationStatus status = statusRepository.findById(dto.getAutomationStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("AutomationStatus not found with id: " + dto.getAutomationStatusId()));
        testCase.setAutomationStatus(status);

        if (dto.getAutomatedById() != null) {
            AutomatedBy automatedBy = automatedByRepository.findById(dto.getAutomatedById())
                    .orElseThrow(() -> new ResourceNotFoundException("AutomatedBy not found with id: " + dto.getAutomatedById()));
            testCase.setAutomatedBy(automatedBy);
        } else {
            testCase.setAutomatedBy(null);
        }

        testCase.setAutomationComments(dto.getAutomationComments());
        testCase.setClubbedTcId(dto.getClubbedTcId());

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (Long tagId : dto.getTagIds()) {
                Tag tag = tagRepository.findById(tagId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id: " + tagId));
                tags.add(tag);
            }
            testCase.setTags(tags);
        } else {
            testCase.setTags(new HashSet<>());
        }
    }
}

