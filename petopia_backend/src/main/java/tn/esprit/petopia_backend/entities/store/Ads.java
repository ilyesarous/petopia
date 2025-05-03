package tn.esprit.petopia_backend.entities.store;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Ads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAds;
    private String title;
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    private StatusType status;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    private Date startDate;
    private Date endDate;
}
