package com.example.expensetracker.dto;

import com.example.expensetracker.entity.Type;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionResponseDto {


    private Long id;
    private BigDecimal amount;
    private Type type;
    private String description;
    private LocalDate date;
    private LocalDateTime createdAt;
    private Long categoryId;
    private String categoryName;
}
