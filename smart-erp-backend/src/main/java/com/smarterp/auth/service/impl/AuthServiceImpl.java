package com.smarterp.auth.service.impl;

import com.smarterp.auth.dto.AuthResponse;
import com.smarterp.auth.dto.LoginRequest;
import com.smarterp.auth.dto.RegisterRequest;
import com.smarterp.auth.dto.UserDto;
import com.smarterp.auth.entity.User;
import com.smarterp.common.exception.EmailAlreadyExistsException;
import com.smarterp.auth.repository.UserRepo;
import com.smarterp.auth.service.AuthService;
import com.smarterp.common.security.JwtService;
import com.smarterp.common.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        User savedUser = userRepo.save(user);
        
        // Publish UserCreatedEvent
        eventPublisher.publishEvent(new com.smarterp.auth.event.UserCreatedEvent(
                this, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole().name()));

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

        // Publish LoginSucceededEvent
        eventPublisher.publishEvent(new com.smarterp.auth.event.LoginSucceededEvent(this, user.getEmail()));

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
        
        // Publish PasswordChangedEvent
        eventPublisher.publishEvent(new com.smarterp.auth.event.PasswordChangedEvent(this, email));
    }

    @Override
    @Transactional
    public void assignRole(java.util.UUID userId, String role) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        user.setRole(com.smarterp.auth.entity.enums.Role.valueOf(role.toUpperCase()));
        userRepo.save(user);
        
        // Publish RoleAssignedEvent
        eventPublisher.publishEvent(new com.smarterp.auth.event.RoleAssignedEvent(this, userId, role));
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
