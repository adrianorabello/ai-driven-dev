package com.edu.ordersystem.service.impl;

import com.edu.ordersystem.dto.OrderItemDTO;
import com.edu.ordersystem.dto.OrderRequestDTO;
import com.edu.ordersystem.dto.OrderResponseDTO;
import com.edu.ordersystem.exception.ResourceNotFoundException;
import com.edu.ordersystem.model.*;
import com.edu.ordersystem.repository.OrderRepository;
import com.edu.ordersystem.repository.ProductRepository;
import com.edu.ordersystem.repository.UserRepository;
import com.edu.ordersystem.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.OPEN);

        List<OrderItem> items = orderRequest.getItems().stream().map(itemRequest -> {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice()); // Snapshot price
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotal(total);

        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    @Override
    public Page<OrderResponseDTO> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    public Page<OrderResponseDTO> findMyOrders(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByUserId(user.getId(), pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional
    public OrderResponseDTO updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        return mapToDTO(orderRepository.save(order));
    }

    private OrderResponseDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream().map(item -> OrderItemDTO.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getPrice())
                .subTotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build()).collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userEmail(order.getUser().getEmail())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus())
                .total(order.getTotal())
                .items(itemDTOs)
                .build();
    }

    @Override
    @Transactional
    public void deleteOrder(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!order.getUser().getId().equals(user.getId()) &&
                user.getRoles().stream().noneMatch(r -> r.equals(RoleName.ROLE_ADMIN))) {
            throw new RuntimeException("You are not authorized to delete this order");
        }

        if (order.getStatus() != OrderStatus.OPEN) {
            throw new RuntimeException("Order cannot be deleted because it is not in OPEN status");
        }

        orderRepository.delete(order);
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrder(Long id, OrderRequestDTO orderRequest, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!order.getUser().getId().equals(user.getId()) &&
                user.getRoles().stream().noneMatch(r -> r.equals(RoleName.ROLE_ADMIN))) {
            throw new RuntimeException("You are not authorized to update this order");
        }

        if (order.getStatus() != OrderStatus.OPEN) {
            throw new RuntimeException("Order cannot be updated because it is not in OPEN status");
        }

        // Clear existing items (orphan removal should handle deletion if configured,
        // but explicit clear is safer here)
        order.getItems().clear();

        List<OrderItem> items = orderRequest.getItems().stream().map(itemRequest -> {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice()); // Snapshot price
            return orderItem;
        }).collect(Collectors.toList());

        order.getItems().addAll(items);

        BigDecimal total = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotal(total);

        return mapToDTO(orderRepository.save(order));
    }

    @Override
    public OrderResponseDTO getOrder(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!order.getUser().getId().equals(user.getId()) &&
                user.getRoles().stream().noneMatch(r -> r.equals(RoleName.ROLE_ADMIN))) {
            throw new RuntimeException("You are not authorized to view this order");
        }
        return mapToDTO(order);
    }
}
