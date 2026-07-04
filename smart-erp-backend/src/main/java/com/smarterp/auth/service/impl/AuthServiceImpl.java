package com.smarterp.auth.service.impl;

import com.smarterp.auth.dto.AuthResponse;
import com.smarterp.auth.dto.LoginRequest;
import com.smarterp.auth.dto.RegisterRequest;
import com.smarterp.auth.dto.UserDto;
import com.smarterp.auth.entity.User;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.auth.repository.UserRepo;
import com.smarterp.auth.service.AuthService;
import com.smarterp.common.security.JwtService;
import com.smarterp.common.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new BusinessValidationException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        User savedUser = userRepo.save(user);
        
        log.info("[AUDIT LOG] User registered: {} ({})", savedUser.getEmail(), savedUser.getId());

        String jwtToken = jwtService.generateToken(new AuthenticatedUser(savedUser));

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        log.info("[AUDIT LOG] Login Succeeded for user: {}", user.getEmail());

        String jwtToken = jwtService.generateToken(new AuthenticatedUser(user));

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public void changePassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        
        log.info("[AUDIT LOG] Password Changed for user: {}", email);
    }

    @Override
    @Transactional
    public void assignRole(java.util.UUID userId, String role) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        user.setRole(com.smarterp.auth.entity.enums.Role.valueOf(role.toUpperCase()));
        userRepo.save(user);
        
        log.info("[AUDIT LOG] Role assigned to user {}: {}", userId, role);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
