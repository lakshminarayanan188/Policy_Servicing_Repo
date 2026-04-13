package com.company.policyserve.service;

import com.company.policyserve.dto.SchedulerDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class SchedulerService {

    public List<SchedulerDTO> getAllSchedulers() {
        return new ArrayList<>(); // To be implemented
    }

    public void triggerRun(Long id) {
        // Trigger logic
    }
}
