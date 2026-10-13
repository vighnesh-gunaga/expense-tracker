package com.example.expensetracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(
            String toEmail,
            String resetToken) {

        String resetLink =
                frontendUrl + "/reset-password?token=" + resetToken;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(fromEmail);

        message.setTo(toEmail);

        message.setSubject(
                "Expense Tracker - Password Reset"
        );

        message.setText(
                "Hello,\n\n" +

                        "You requested to reset your Expense Tracker password.\n\n" +

                        "Click the link below to reset your password:\n\n" +

                        resetLink + "\n\n" +

                        "This link can be used to reset your password.\n\n" +

                        "If you did not request this password reset, " +
                        "you can ignore this email.\n\n" +

                        "Regards,\n" +
                        "Expense Tracker"
        );

        try {

            mailSender.send(message);

            System.out.println(
                    "PASSWORD RESET EMAIL SENT TO: "
                            + toEmail
            );

        } catch (Exception e) {

            System.out.println(
                    "===== EMAIL SENDING ERROR ====="
            );

            e.printStackTrace();

            System.out.println(
                    "================================"
            );

            throw new RuntimeException(
                    "Failed to send password reset email",
                    e
            );
        }
    }
}