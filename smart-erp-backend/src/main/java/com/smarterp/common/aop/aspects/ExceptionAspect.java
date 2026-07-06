package com.smarterp.common.aop.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ExceptionAspect {

    @AfterThrowing(pointcut = "com.smarterp.common.aop.pointcuts.CommonPointcuts.controllerLayer() || com.smarterp.common.aop.pointcuts.CommonPointcuts.serviceLayer()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getMethod().getName();
        String traceId = MDC.get("traceId");
        String prefix = traceId != null ? "[Trace ID: " + traceId + "] " : "";

        // Determine severity of logs
        if (ex instanceof com.smarterp.common.exception.BusinessValidationException ||
            ex instanceof com.smarterp.common.exception.ResourceNotFoundException) {
            log.warn("{}Validation/Resource exception in {}.{}(): {}", prefix, className, methodName, ex.getMessage());
        } else {
            log.error("{}UNEXPECTED EXCEPTION in {}.{}(): {}", prefix, className, methodName, ex.getMessage(), ex);
        }
    }
}
