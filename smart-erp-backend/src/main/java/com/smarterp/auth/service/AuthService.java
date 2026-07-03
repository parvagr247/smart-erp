package com.smarterp.auth.service;

import com.smarterp.auth.dto.AuthResponse;
import com.smarterp.auth.dto.LoginRequest;
import com.smarterp.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void changePassword(String email, String newPassword);
    void assignRole(java.util.UUID userId, String role);
}
