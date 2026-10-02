package com.example.expensetracker.dto;

import com.example.expensetracker.entity.Type;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryResponseDto {
    private Long id;
    private String name;
    private Type type;
}
