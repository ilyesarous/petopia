package tn.esprit.petopia_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationDTO {
    private Long id;
    private Long serviceId;
    private Long userId;
    private LocalDateTime reservationDate;
    private String status; // e.g., "PENDING", "CONFIRMED", "CANCELLED"
    private String specialRequests;
}
