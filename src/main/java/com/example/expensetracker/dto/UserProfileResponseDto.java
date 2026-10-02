package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserProfileResponseDto {

    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
}