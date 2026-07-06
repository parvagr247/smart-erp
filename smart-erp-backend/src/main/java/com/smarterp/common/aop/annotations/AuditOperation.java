package com.smarterp.common.aop.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditOperation {
    /**
     * The action performed (e.g., 'CREATED', 'UPDATED', 'DELETED', or SpEL expression)
     */
    String action();

    /**
     * The entity type targeted (e.g., 'BusinessPartner', 'Ledger', etc.)
     */
    String entityType();

    /**
     * SpEL expression to evaluate details message.
     */
    String details() default "";

    /**
     * SpEL expression to evaluate entity ID (UUID).
     */
    String entityId() default "";

    /**
     * SpEL expression for condition to audit (must evaluate to boolean).
     */
    String condition() default "";
}
