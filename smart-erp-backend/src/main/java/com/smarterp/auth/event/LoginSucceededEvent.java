package com.smarterp.auth.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class LoginSucceededEvent extends ApplicationEvent {
    private final String email;

    public LoginSucceededEvent(Object source, String email) {
        super(source);
        this.email = email;
    }
}
