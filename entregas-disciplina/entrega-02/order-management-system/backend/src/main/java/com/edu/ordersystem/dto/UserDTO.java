package com.edu.ordersystem.dto;

import com.edu.ordersystem.model.RoleName;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password; // Only for creation
    private Set<RoleName> roles;
}
