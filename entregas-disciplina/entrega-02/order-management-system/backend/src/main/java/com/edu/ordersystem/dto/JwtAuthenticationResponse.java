package com.edu.ordersystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String email;
    private List<String> roles;

    public JwtAuthenticationResponse(String accessToken, String email, List<String> roles) {
        this.accessToken = accessToken;
        this.email = email;
        this.roles = roles;
    }
}
