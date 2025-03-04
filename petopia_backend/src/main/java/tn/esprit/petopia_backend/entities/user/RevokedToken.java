package tn.esprit.petopia_backend.entities.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "revoked_tokens")
public class RevokedToken {
    @Id
    private String token;

    private Instant revokedAt;

    public RevokedToken(String token, Instant revokedAt) {
        this.token = token;
        this.revokedAt = revokedAt;
    }

    public RevokedToken() {

    }
}
