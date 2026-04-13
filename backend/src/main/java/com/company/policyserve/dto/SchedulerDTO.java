package com.company.policyserve.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SchedulerDTO {
    private Long id;
    private String name;
    private String moduleCode;
    private String jobClass;
    private LocalDateTime lastRunTime;
    private String status;
    private LocalDateTime nextRunTime;
    private String frequency;
    private Boolean isEnabled;
}
