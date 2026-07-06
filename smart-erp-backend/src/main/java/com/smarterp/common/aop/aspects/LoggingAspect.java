package com.smarterp.common.aop.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("com.smarterp.common.aop.pointcuts.CommonPointcuts.controllerLayer() || com.smarterp.common.aop.pointcuts.CommonPointcuts.serviceLayer()")
    public Object logMethodLifecycle(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getMethod().getName();
        String traceId = MDC.get("traceId");
        String prefix = traceId != null ? "[Trace ID: " + traceId + "] " : "";

        // Log entry parameters
        Object[] args = joinPoint.getArgs();
        String[] paramNames = signature.getParameterNames();
        String maskedArgs = getMaskedArgs(paramNames, args);
        log.info("{}Entering {}.{} with params: [{}]", prefix, className, methodName, maskedArgs);

        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            // Log exit
            log.info("{}Exited {}.{} returning [{}] (took {}ms)", prefix, className, methodName, 
                     maskSensitiveResult(methodName, result), duration);
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - start;
            log.warn("{}Method {}.{} failed with exception: {} (took {}ms)", prefix, className, methodName, ex.getMessage(), duration);
            throw ex;
        }
    }

    private String getMaskedArgs(String[] paramNames, Object[] args) {
        if (args == null || paramNames == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < args.length; i++) {
            if (i > 0) sb.append(", ");
            String name = paramNames[i].toLowerCase();
            if (name.contains("password") || name.contains("token") || name.contains("jwt") || name.contains("secret") || name.contains("credential")) {
                sb.append(paramNames[i]).append("=[MASKED]");
            } else {
                sb.append(paramNames[i]).append("=").append(args[i]);
            }
        }
        return sb.toString();
    }

    private String maskSensitiveResult(String methodName, Object result) {
        if (result == null) return "null";
        String lowerMethod = methodName.toLowerCase();
        if (lowerMethod.contains("login") || lowerMethod.contains("auth") || lowerMethod.contains("token")) {
            return "[MASKED SENSITIVE RESPONSE]";
        }
        return result.toString();
    }
}
