package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "testcase_id", nullable = false, unique = true)
    private String testcaseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_module_id")
    private SubModule subModule;

    @Column(name = "test_case_description", nullable = false, columnDefinition = "TEXT")
    private String testCaseDescription;

    @Column(name = "pre_conditions", columnDefinition = "TEXT")
    private String preConditions;

    @Column(name = "test_script", nullable = false, columnDefinition = "TEXT")
    private String testScript;

    @Column(name = "expected_result", nullable = false, columnDefinition = "TEXT")
    private String expectedResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "priority_id", nullable = false)
    private TestCasePriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automation_status_id", nullable = false)
    private AutomationStatus automationStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automated_by_id")
    private AutomatedBy automatedBy;

    @Column(name = "automation_comments", columnDefinition = "TEXT")
    private String automationComments;

    @Column(name = "clubbed_tc_id")
    private String clubbedTcId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "test_case_tags",
        joinColumns = @JoinColumn(name = "test_case_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

