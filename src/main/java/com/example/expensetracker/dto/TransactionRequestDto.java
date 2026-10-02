package com.example.expensetracker.dto;

import com.example.expensetracker.entity.Type;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter
@Setter
public class TransactionRequestDto {
    @NotNull(message = "Amount Required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than or equal to 0.01")
    private BigDecimal amount;
    @NotNull(message = "Type cannot be empty")
    private Type type;
    @NotBlank(message = "Cannot be empty")
    @Size(min = 3,max = 100)
    private String description;
    @NotNull(message = "Date Required")
    private LocalDate date;
    @NotBlank(message = "Cannot be empty")
    @Size(min = 2,max = 30)
    private String categoryName;
}
