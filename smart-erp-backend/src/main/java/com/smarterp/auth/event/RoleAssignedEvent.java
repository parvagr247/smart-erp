package com.smarterp.auth.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class RoleAssignedEvent extends ApplicationEvent {
    private final UUID userId;
    private final String newRole;

    public RoleAssignedEvent(Object source, UUID userId, String newRole) {
        super(source);
        this.userId = userId;
        this.newRole = newRole;
    }
}
