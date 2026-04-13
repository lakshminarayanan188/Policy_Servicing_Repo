package com.company.policyserve.controller;

import com.company.policyserve.dto.ModuleDTO;
import com.company.policyserve.dto.StageCountDTO;
import com.company.policyserve.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/modules")
    public ResponseEntity<List<ModuleDTO>> getModules() {
        return ResponseEntity.ok(dashboardService.getModules());
    }

    @GetMapping("/stage-counts")
    public ResponseEntity<List<StageCountDTO>> getStageCounts(
            @RequestParam String module,
            @RequestParam(required = false) String productId,
            @RequestParam(required = false) String dateRange) {
        
        return ResponseEntity.ok(dashboardService.getStageCounts(module, productId, dateRange));
    }
}
