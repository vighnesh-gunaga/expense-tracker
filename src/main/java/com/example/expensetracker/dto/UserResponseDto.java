package com.example.expensetracker.dto;

import com.example.expensetracker.entity.Role;
import com.example.expensetracker.entity.UserType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private UserType userType;

    private LocalDateTime createdAt;
}