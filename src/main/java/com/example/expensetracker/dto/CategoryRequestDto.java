package com.example.expensetracker.dto;

import com.example.expensetracker.entity.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDto {
    @NotBlank(message = "Cannot be blank")
    @Size(min=3,max = 30)
    private String name;
    @NotNull(message = "Type cannot be empty")
    private Type type;
}
