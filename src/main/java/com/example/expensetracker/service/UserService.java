package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.Role;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.EmailAlreadyExistsException;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.expensetracker.entity.PasswordResetToken;
import com.example.expensetracker.repository.PasswordResetTokenRepository;

import java.util.UUID;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService, PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public UserResponseDto register(RegisterRequestDto register) {
        if(userRepository.existsByEmail(register.getEmail()))
        {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        User user = new User();
        user.setName(register.getName());
        user.setEmail(register.getEmail());
        user.setPassword(passwordEncoder.encode(register.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setId(user.getId());
        userResponseDto.setName(user.getName());
        userResponseDto.setEmail(user.getEmail());
        userResponseDto.setRole(user.getRole());
        userResponseDto.setCreatedAt(user.getCreatedAt());

        return userResponseDto;

    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );
        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(()->new UserNotFoundException("User Not Found"));

        String token = jwtService.generateToken(user.getEmail());

        LoginResponseDto response = new LoginResponseDto();

        response.setJwtToken(token);

        return response;


    }
    @Transactional
    public void forgotPassword(ForgotPasswordRequestDto request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserNotFoundException("User Not Found"));

        // Delete old reset token
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Force DELETE to execute before INSERT
        passwordResetTokenRepository.flush();

        // Generate new token
        String token = UUID.randomUUID().toString();

        PasswordResetToken passwordResetToken =
                new PasswordResetToken();

        passwordResetToken.setToken(token);
        passwordResetToken.setUser(user);

        passwordResetTokenRepository.save(passwordResetToken);

        // Send email
        emailService.sendPasswordResetEmail(
                user.getEmail(),
                token
        );
    }
    public void resetPassword(ResetPasswordRequestDto request) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.getToken())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid reset token"));

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        // Token can no longer be reused
        passwordResetTokenRepository.delete(resetToken);
    }

    public UserProfileResponseDto getProfile() {

        User user = getCurrentUser();

        return new UserProfileResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }

    private User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}
