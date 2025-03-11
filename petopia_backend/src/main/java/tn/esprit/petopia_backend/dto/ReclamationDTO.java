package tn.esprit.petopia_backend.dto;

import lombok.Data;
import java.util.Date;

@Data
public class ReclamationDTO {
    private int idReclamation;
    private String type;
    private String description;
    private String statusReclamation;
    private Date dateReclamation;
    private String userName;
}