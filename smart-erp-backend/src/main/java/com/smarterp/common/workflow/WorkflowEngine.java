package com.smarterp.common.workflow;

import org.springframework.stereotype.Component;

@Component
public class WorkflowEngine {

    public boolean canTransition(String currentStatus, String targetStatus) {
        if (currentStatus == null || targetStatus == null) {
            return false;
        }

        String curr = currentStatus.toUpperCase();
        String target = targetStatus.toUpperCase();

        if (curr.equals(target)) {
            return true;
        }

        switch (curr) {
            case "DRAFT":
                return "SUBMITTED".equals(target) || 
                       "PENDING_APPROVAL".equals(target) || 
                       "APPROVED".equals(target) || 
                       "CANCELLED".equals(target);
            case "SUBMITTED":
            case "PENDING_APPROVAL":
                return "APPROVED".equals(target) || 
                       "REJECTED".equals(target) || 
                       "CANCELLED".equals(target);
            case "APPROVED":
                return "CANCELLED".equals(target);
            case "REJECTED":
            case "CANCELLED":
                return false; // Terminal states
            default:
                return false;
        }
    }
}
