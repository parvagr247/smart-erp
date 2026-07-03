package com.smarterp.service;

import com.smarterp.dto.AuthResponse;
import com.smarterp.dto.LoginRequest;
import com.smarterp.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
