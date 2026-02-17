package com.edu.ordersystem.service;

import com.edu.ordersystem.dto.JwtAuthenticationResponse;
import com.edu.ordersystem.dto.LoginRequest;

public interface AuthService {
    JwtAuthenticationResponse login(LoginRequest loginRequest);
}
