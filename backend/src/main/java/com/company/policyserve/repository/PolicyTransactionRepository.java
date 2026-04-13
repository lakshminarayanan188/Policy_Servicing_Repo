package com.company.policyserve.repository;

import com.company.policyserve.entity.PolicyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyTransactionRepository extends JpaRepository<PolicyTransaction, String> {
    
    @Query(value = "SELECT stage_code, COUNT(*) as count FROM POLICY_TRANSACTION WHERE module_code = :moduleCode GROUP BY stage_code", nativeQuery = true)
    List<Object[]> getStageCountsByModule(String moduleCode);
}
