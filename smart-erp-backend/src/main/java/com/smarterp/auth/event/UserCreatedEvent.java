package com.smarterp.auth.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class UserCreatedEvent extends ApplicationEvent {
    private final UUID userId;
    private final String email;
    private final String fullName;
    private final String role;

    public UserCreatedEvent(Object source, UUID userId, String email, String fullName, String role) {
        super(source);
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }
}
