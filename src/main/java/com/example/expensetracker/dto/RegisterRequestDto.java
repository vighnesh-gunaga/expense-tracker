package com.example.expensetracker.dto;


import com.example.expensetracker.entity.UserType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Please enter a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$",
            message = "Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
    )
    private String password;

    @NotNull(message = "Please select what describes you")
    private UserType userType;

    // getters/setters
}
