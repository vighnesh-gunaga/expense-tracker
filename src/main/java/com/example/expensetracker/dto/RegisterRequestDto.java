package com.example.expensetracker.dto;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {
    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2,max = 20)
    private String name;
    @NotBlank(message = "Email Required")
    @Email
    private String email;
    @NotBlank(message = "Password Required")
    @Size(min = 8,max = 15)
    @Pattern( regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$",
            message = "Password must be 8-15 characters long, include at least one uppercase letter, " +
                    "one lowercase letter, one number, and one special character (@$!%*?&)." )
    private String password;
}
