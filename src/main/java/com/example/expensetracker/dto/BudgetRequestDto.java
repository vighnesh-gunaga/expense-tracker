package com.example.expensetracker.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class BudgetRequestDto {
    @NotNull(message = "Limit Amount Required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than or equal to 0.01")
    private BigDecimal limitAmount;
    @NotNull(message = "Month required")
    @Min(1)
    @Max(12)
    private Integer month;
    @NotNull(message = "Year Required")
    @Min(2000)
    @Max(2100)
    private Integer year;
    @NotBlank(message = "Category Name required")
    @Size(min = 2,max = 30)
    private String categoryName;
}
