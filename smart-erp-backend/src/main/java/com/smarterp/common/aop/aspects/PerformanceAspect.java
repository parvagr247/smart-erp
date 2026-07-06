package com.smarterp.common.aop.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    @Value("${smarterp.performance.threshold.controller:1000}")
    private long controllerThreshold;

    @Value("${smarterp.performance.threshold.service:500}")
    private long serviceThreshold;

    @Value("${smarterp.performance.threshold.repository:300}")
    private long repositoryThreshold;

    @Around("com.smarterp.common.aop.pointcuts.CommonPointcuts.controllerLayer()")
    public Object monitorControllerPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorPerformance(joinPoint, controllerThreshold, "Controller");
    }

    @Around("com.smarterp.common.aop.pointcuts.CommonPointcuts.serviceLayer()")
    public Object monitorServicePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorPerformance(joinPoint, serviceThreshold, "Service");
    }

    @Around("com.smarterp.common.aop.pointcuts.CommonPointcuts.repositoryLayer()")
    public Object monitorRepositoryPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        return monitorPerformance(joinPoint, repositoryThreshold, "Repository");
    }

    private Object monitorPerformance(ProceedingJoinPoint joinPoint, long threshold, String layer) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long duration = System.currentTimeMillis() - start;
            if (duration > threshold) {
                MethodSignature signature = (MethodSignature) joinPoint.getSignature();
                String traceId = MDC.get("traceId");
                String prefix = traceId != null ? "[Trace ID: " + traceId + "] " : "";
                log.warn("{}PERFORMANCE WARNING: {} execution of {}.{} took {}ms (threshold is {}ms)",
                        prefix, layer, signature.getDeclaringType().getSimpleName(), signature.getMethod().getName(), duration, threshold);
            }
        }
    }
}
