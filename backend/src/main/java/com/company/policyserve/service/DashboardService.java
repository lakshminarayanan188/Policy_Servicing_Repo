package com.company.policyserve.service;

import com.company.policyserve.dto.ModuleDTO;
import com.company.policyserve.dto.StageCountDTO;
import com.company.policyserve.repository.PolicyTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PolicyTransactionRepository policyRepo;

    public List<ModuleDTO> getModules() {
        return new ArrayList<>(); // To be implemented
    }

    public List<StageCountDTO> getStageCounts(String module, String productId, String dateRange) {
        return new ArrayList<>(); // To be implemented
    }
}
