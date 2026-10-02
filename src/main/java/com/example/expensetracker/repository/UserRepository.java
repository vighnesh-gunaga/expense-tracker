package com.example.expensetracker.repository;

import com.example.expensetracker.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    boolean existsByEmail(String email);



    Optional<User> findByEmail(@NotBlank(message = "Email required") @Email String email);
}
