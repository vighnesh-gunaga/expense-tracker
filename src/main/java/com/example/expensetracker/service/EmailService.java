package com.example.expensetracker.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(
            String toEmail,
            String resetToken) {

        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + resetToken;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject(
                "Expense Tracker - Password Reset"
        );

        message.setText(
                "Hello,\n\n" +
                        "You requested to reset your Expense Tracker password.\n\n" +
                        "Click the link below to reset your password:\n\n" +
                        resetLink +
                        "\n\n" +
                        "If you did not request this password reset, " +
                        "you can ignore this email.\n\n" +
                        "Regards,\n" +
                        "Expense Tracker"
        );

        mailSender.send(message);
    }
}