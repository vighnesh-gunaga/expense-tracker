package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@Getter
@AllArgsConstructor
public class ValidationErrorResponseDto {

    private Map<String, String> errors;
}