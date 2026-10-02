package com.example.expensetracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CategoryExpenseResponseDto {

    private Long categoryId;
    private String categoryName;
    private BigDecimal totalExpense;
}