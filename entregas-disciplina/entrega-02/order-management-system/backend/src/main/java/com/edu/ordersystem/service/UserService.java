package com.edu.ordersystem.service;

import com.edu.ordersystem.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDTO> findAll(Pageable pageable);

    UserDTO create(UserDTO userDTO);
}
