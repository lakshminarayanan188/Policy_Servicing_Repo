package com.company.policyserve.controller;

import com.company.policyserve.dto.SchedulerDTO;
import com.company.policyserve.service.SchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schedulers")
@RequiredArgsConstructor
public class SchedulerController {

    private final SchedulerService schedulerService;

    @GetMapping
    public ResponseEntity<List<SchedulerDTO>> getAllSchedulers() {
        return ResponseEntity.ok(schedulerService.getAllSchedulers());
    }

    @PostMapping("/{id}/trigger")
    public ResponseEntity<?> triggerRun(@PathVariable Long id) {
        schedulerService.triggerRun(id);
        return ResponseEntity.ok().build();
    }
}
