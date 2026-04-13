package com.company.policyserve.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "POLICY_TRANSACTION")
@Data
public class PolicyTransaction {
    @Id
    private String policyNo;
    private String moduleCode;
    private String productId;
    private String stageCode;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
