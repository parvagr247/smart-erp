package com.smarterp.common.aop.aspects;

import com.smarterp.common.aop.annotations.AuditOperation;
import com.smarterp.common.audit.AuditLogService;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.dto.StockItemRequest;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.DefaultParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;
import java.lang.reflect.Method;
import java.util.UUID;
import org.slf4j.MDC;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditLogService auditLogService;
    private final EntityManager entityManager;
    private final ExpressionParser parser = new SpelExpressionParser();
    private final ParameterNameDiscoverer nameDiscoverer = new DefaultParameterNameDiscoverer();

    @org.aspectj.lang.annotation.Before("execution(* com.smarterp.inventory.master.service.impl.StockItemServiceImpl.updateItem(..)) && args(id, request, company)")
    public void captureOldStockItemQty(UUID id, StockItemRequest request, Company company) {
        try {
            com.smarterp.inventory.master.entity.StockItem item = entityManager.find(com.smarterp.inventory.master.entity.StockItem.class, id);
            if (item != null) {
                MDC.put("oldQty", item.getCurrentQuantity() != null ? item.getCurrentQuantity().toString() : "0");
            }
        } catch (Exception e) {
            log.warn("Failed to capture old stock quantity in before advice", e);
        }
    }

    @AfterReturning(pointcut = "com.smarterp.common.aop.pointcuts.CommonPointcuts.serviceLayer() && @annotation(auditAnnotation)", returning = "result")
    public void auditMethod(JoinPoint joinPoint, AuditOperation auditAnnotation, Object result) {
        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            Object[] args = joinPoint.getArgs();
            String[] paramNames = nameDiscoverer.getParameterNames(method);

            // Set up SpEL context
            EvaluationContext context = new StandardEvaluationContext();
            if (paramNames != null && args != null) {
                for (int i = 0; i < paramNames.length; i++) {
                    context.setVariable(paramNames[i], args[i]);
                }
            }
            context.setVariable("result", result);

            // Copy MDC context map to SpEL variables
            java.util.Map<String, String> mdcMap = MDC.getCopyOfContextMap();
            if (mdcMap != null) {
                for (java.util.Map.Entry<String, String> entry : mdcMap.entrySet()) {
                    context.setVariable(entry.getKey(), entry.getValue());
                }
            }

            // Evaluate condition if specified
            String conditionExpression = auditAnnotation.condition();
            if (conditionExpression != null && !conditionExpression.isEmpty()) {
                try {
                    Boolean shouldAudit = parser.parseExpression(conditionExpression).getValue(context, Boolean.class);
                    if (shouldAudit != null && !shouldAudit) {
                        return; // Skip audit log
                    }
                } catch (Exception e) {
                    log.warn("Failed to parse SpEL condition: {}", conditionExpression, e);
                }
            }

            // Evaluate action
            String action = auditAnnotation.action();
            if (action.startsWith("#") || action.contains("?") || action.contains("result") || action.contains("'")) {
                try {
                    action = parser.parseExpression(action).getValue(context, String.class);
                } catch (Exception e) {
                    log.warn("Failed to parse SpEL expression for audit action: {}", action, e);
                }
            }

            // Evaluate details
            String details = auditAnnotation.details();
            if (details.startsWith("#") || details.contains("?") || details.contains("result") || details.contains("'")) {
                try {
                    details = parser.parseExpression(details).getValue(context, String.class);
                } catch (Exception e) {
                    log.warn("Failed to parse SpEL expression for audit details: {}", details, e);
                }
            }

            // Resolve company
            Company company = null;
            if (args != null) {
                for (Object arg : args) {
                    if (arg instanceof Company) {
                        company = (Company) arg;
                        break;
                    }
                }
            }
            if (company == null && result != null) {
                try {
                    Method getCompanyMethod = result.getClass().getMethod("getCompany");
                    company = (Company) getCompanyMethod.invoke(result);
                } catch (Exception ignored) {}
                if (company == null) {
                    try {
                        Method getCompanyIdMethod = result.getClass().getMethod("getCompanyId");
                        UUID cid = (UUID) getCompanyIdMethod.invoke(result);
                        if (cid != null) {
                            company = entityManager.getReference(Company.class, cid);
                        }
                    } catch (Exception ignored) {}
                }
                if (company == null && auditAnnotation.entityType().equals("Company")) {
                    try {
                        Method getIdMethod = result.getClass().getMethod("getId");
                        UUID cid = (UUID) getIdMethod.invoke(result);
                        if (cid != null) {
                            company = entityManager.getReference(Company.class, cid);
                        }
                    } catch (Exception ignored) {}
                }
            }

            if (company == null) {
                log.warn("Could not resolve Company context for audited method: {}. Skipping audit log.", method.getName());
                return;
            }

            // Resolve entity ID
            UUID entityId = null;
            String entityIdExpression = auditAnnotation.entityId();
            if (entityIdExpression != null && !entityIdExpression.isEmpty()) {
                try {
                    entityId = parser.parseExpression(entityIdExpression).getValue(context, UUID.class);
                } catch (Exception e) {
                    log.warn("Failed to parse entity ID expression: {}", entityIdExpression, e);
                }
            }
            if (entityId == null) {
                if (result != null) {
                    try {
                        Method getIdMethod = result.getClass().getMethod("getId");
                        entityId = (UUID) getIdMethod.invoke(result);
                    } catch (Exception ignored) {}
                }
                if (entityId == null && args != null) {
                    for (Object arg : args) {
                        if (arg instanceof UUID) {
                            entityId = (UUID) arg;
                            break;
                        }
                    }
                }
            }

            auditLogService.saveLog(company.getId(), auditAnnotation.entityType(), entityId, action, details);
        } catch (Exception e) {
            log.error("Error processing audit log aspect", e);
        }
    }
}
