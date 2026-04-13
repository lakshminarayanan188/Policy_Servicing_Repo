package com.company.policyserve.dto;

import lombok.Data;

@Data
public class StageCountDTO {
    private String stageCode;
    private String stageName;
    private Long count;
    private Long previousCount;
    private Double percentChange;
}
