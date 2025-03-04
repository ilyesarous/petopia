package tn.esprit.petopia_backend.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import tn.esprit.petopia_backend.entities.user.User;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;

    private String name;
    private String role;
    private String email;
    private String password;
    private String phone_number ;
    private Boolean locked;
    private int nb_points;
    private User ourUsers;
    private List<User> ourUsersList;
    private String userId;

    public ReqRes(HttpStatus httpStatus, String tokenRevokedSuccessfully) {
    }

    public ReqRes() {

    }
}

