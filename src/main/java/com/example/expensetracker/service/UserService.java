package com.example.expensetracker.service;

import com.example.expensetracker.dto.*;
import com.example.expensetracker.entity.PasswordResetToken;
import com.example.expensetracker.entity.Role;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.EmailAlreadyExistsException;
import com.example.expensetracker.exception.UserNotFoundException;
import com.example.expensetracker.repository.PasswordResetTokenRepository;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private final EmailService emailService;

    private final CategoryService categoryService;


    // =========================
    // CONSTRUCTOR
    // =========================

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService,
            CategoryService categoryService
    ) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.authenticationManager = authenticationManager;

        this.jwtService = jwtService;

        this.passwordResetTokenRepository =
                passwordResetTokenRepository;

        this.emailService = emailService;

        this.categoryService = categoryService;
    }


    // =========================
    // REGISTER
    // =========================

    public UserResponseDto register(
            RegisterRequestDto register
    ) {

        // Check whether email already exists
        if (userRepository.existsByEmail(
                register.getEmail()
        )) {

            throw new EmailAlreadyExistsException(
                    "Email already exists"
            );
        }


        // Create new user
        User user = new User();


        // Basic user information
        user.setName(
                register.getName()
        );

        user.setEmail(
                register.getEmail()
        );


        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(
                        register.getPassword()
                )
        );


        // Default role
        user.setRole(
                Role.USER
        );


        // Save selected user type
        user.setUserType(
                register.getUserType()
        );


        // Account creation time
        user.setCreatedAt(
                LocalDateTime.now()
        );


        // Save user first
        userRepository.save(user);


        // Create personalized default categories
        // according to the selected user type
        categoryService.createDefaultCategories(
                user
        );


        // =========================
        // RESPONSE
        // =========================

        UserResponseDto userResponseDto =
                new UserResponseDto();


        userResponseDto.setId(
                user.getId()
        );


        userResponseDto.setName(
                user.getName()
        );


        userResponseDto.setEmail(
                user.getEmail()
        );


        userResponseDto.setRole(
                user.getRole()
        );


        userResponseDto.setUserType(
                user.getUserType()
        );


        userResponseDto.setCreatedAt(
                user.getCreatedAt()
        );


        return userResponseDto;
    }


    // =========================
    // LOGIN
    // =========================

    public LoginResponseDto login(
            LoginRequestDto loginRequestDto
    ) {

        // Authenticate user
        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        loginRequestDto.getEmail(),

                        loginRequestDto.getPassword()
                )
        );


        // Find authenticated user
        User user =
                userRepository
                        .findByEmail(
                                loginRequestDto.getEmail()
                        )
                        .orElseThrow(
                                () -> new UserNotFoundException(
                                        "User Not Found"
                                )
                        );


        // Generate JWT token
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // Create response
        LoginResponseDto response =
                new LoginResponseDto();


        response.setJwtToken(
                token
        );


        return response;
    }


    // =========================
    // FORGOT PASSWORD
    // =========================

    @Transactional
    public void forgotPassword(
            ForgotPasswordRequestDto request
    ) {

        // Find user by email
        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () -> new UserNotFoundException(
                                        "User Not Found"
                                )
                        );


        // Delete previous reset tokens
        passwordResetTokenRepository
                .deleteByUserId(
                        user.getId()
                );


        passwordResetTokenRepository.flush();


        // Generate new reset token
        String token =
                UUID.randomUUID().toString();


        // Create password reset token
        PasswordResetToken passwordResetToken =
                new PasswordResetToken();


        passwordResetToken.setToken(
                token
        );


        passwordResetToken.setUser(
                user
        );


        // Save reset token
        passwordResetTokenRepository.save(
                passwordResetToken
        );


        // Send reset email
        emailService.sendPasswordResetEmail(
                user.getEmail(),
                token
        );
    }


    // =========================
    // RESET PASSWORD
    // =========================

    public void resetPassword(
            ResetPasswordRequestDto request
    ) {

        // Find reset token
        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(
                                request.getToken()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Invalid reset token"
                                )
                        );


        // Get associated user
        User user =
                resetToken.getUser();


        // Encode new password
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        // Save updated user
        userRepository.save(
                user
        );


        // Delete used reset token
        passwordResetTokenRepository.delete(
                resetToken
        );
    }


    // =========================
    // PROFILE
    // =========================

    public UserProfileResponseDto getProfile() {

        User user =
                getCurrentUser();


        return new UserProfileResponseDto(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getCreatedAt()
        );
    }


    // =========================
    // CURRENT USER
    // =========================

    private User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        return userRepository
                .findByEmail(
                        email
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }
}