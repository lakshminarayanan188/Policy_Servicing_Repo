-- Setup Initial Modules
INSERT INTO MODULE_CONFIG (module_code, module_name) VALUES ('SB', 'Survival Benefit');
INSERT INTO MODULE_CONFIG (module_code, module_name) VALUES ('MAT', 'Maturity');
INSERT INTO MODULE_CONFIG (module_code, module_name) VALUES ('ANN', 'Annuity');
INSERT INTO MODULE_CONFIG (module_code, module_name) VALUES ('SUR', 'Surrender');
INSERT INTO MODULE_CONFIG (module_code, module_name) VALUES ('DEC', 'Death Claim');

-- Setup Initial Products
INSERT INTO PRODUCT_CONFIG (product_id, module_code, product_name) VALUES ('P001', 'SB', 'Endowment Plan A');
INSERT INTO PRODUCT_CONFIG (product_id, module_code, product_name) VALUES ('P002', 'SB', 'Money Back Plan');
INSERT INTO PRODUCT_CONFIG (product_id, module_code, product_name) VALUES ('P003', 'MAT', 'Jeevan Anand');
INSERT INTO PRODUCT_CONFIG (product_id, module_code, product_name) VALUES ('P004', 'MAT', 'Endowment Plan B');
INSERT INTO PRODUCT_CONFIG (product_id, module_code, product_name) VALUES ('P005', 'ANN', 'Pension Plus');

-- Setup Schedulers
INSERT INTO SCHEDULER_CONFIG (id, scheduler_name, module_code, job_class, cron_expression) 
VALUES (1, 'SB Extract Daily', 'SB', 'com.company.policyserve.scheduler.jobs.SbExtractJob', '0 0 9 * * ?');

INSERT INTO SCHEDULER_CONFIG (id, scheduler_name, module_code, job_class, cron_expression) 
VALUES (2, 'Maturity Approval Sync', 'MAT', 'com.company.policyserve.scheduler.jobs.MatApproveJob', '0 0/15 * * * ?');

INSERT INTO SCHEDULER_CONFIG (id, scheduler_name, module_code, job_class, cron_expression) 
VALUES (3, 'Payment Gateway Sync', NULL, 'com.company.policyserve.scheduler.jobs.PaymentSyncJob', '0 0/5 * * * ?');

-- Initial Scheduler Logs (dummy history)
INSERT INTO SCHEDULER_LOG (scheduler_id, start_time, end_time, status, records_processed) 
VALUES (1, CURRENT_TIMESTAMP - INTERVAL '1' DAY, CURRENT_TIMESTAMP - INTERVAL '23' HOUR, 'SUCCESS', 1500);

INSERT INTO SCHEDULER_LOG (scheduler_id, start_time, end_time, status, records_processed) 
VALUES (2, CURRENT_TIMESTAMP - INTERVAL '15' MINUTE, CURRENT_TIMESTAMP - INTERVAL '14' MINUTE, 'SUCCESS', 45);

INSERT INTO SCHEDULER_LOG (scheduler_id, start_time, end_time, status, records_processed, error_message) 
VALUES (3, CURRENT_TIMESTAMP - INTERVAL '5' MINUTE, CURRENT_TIMESTAMP - INTERVAL '4' MINUTE, 'FAILED', 0, 'Connection timeout to PG gateway');

-- Dummy Policy Transactions (Extracted)
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL1001', 'SB', 'P001', 'EXTRACT', 50000);
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL1002', 'SB', 'P001', 'EXTRACT', 150000);
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL1003', 'MAT', 'P003', 'EXTRACT', 75000);

-- Dummy Policy Transactions (Approved)
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL2001', 'SB', 'P002', 'APPROVE', 80000);
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL2002', 'MAT', 'P004', 'APPROVE', 1000000);

-- Dummy Policy Transactions (Tech Bucket)
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL3001', 'ANN', 'P005', 'TECH_BUCKET', 20000);

-- Dummy Policy Transactions (Sanction)
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL4001', 'SB', 'P001', 'SANCTION', 120000);

-- Dummy Policy Transactions (Paid)
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL5001', 'SB', 'P002', 'PAID', 50000);
INSERT INTO POLICY_TRANSACTION (policy_no, module_code, product_id, stage_code, amount) VALUES ('POL5002', 'SUR', 'P001', 'PAID', 45000);
