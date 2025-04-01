package tn.esprit.petopia_backend.dto;

import lombok.Data;

import java.util.Date;




@Data
public class SignupNotification {
    private String userId;
    private String name;
    private String email;
    private Date timestamp;

    public SignupNotification() {}

    public SignupNotification(String userId, String name, String email, Date timestamp) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.timestamp = timestamp;
    }

}