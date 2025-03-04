package  tn.esprit.petopia_backend.services.user;


import tn.esprit.petopia_backend.entities.user.RevokedToken;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.user.UserRole;
import tn.esprit.petopia_backend.repositories.user.RevokedTokenRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.dto.ReqRes;
import tn.esprit.petopia_backend.security.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TaskScheduler taskScheduler;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=<>?";
    private static final int PASSWORD_LENGTH = 12;
    public ReqRes register(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();

        try {
            User ourUser = new User();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setPhone_number(registrationRequest.getPhone_number());
            ourUser.setName(registrationRequest.getName());
            UserRole role = UserRole.valueOf(registrationRequest.getRole().toUpperCase());
            ourUser.setRole(role);
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            User ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId_user()>0) {
                resp.setOurUsers((ourUsersResult));
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();
        try {
            System.out.println("Login Request: " + loginRequest.getEmail());
            System.out.println("Password Provided: " + loginRequest.getPassword());

            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Invalid password");
            }

            var jwt = jwtUtils.generateToken(user, Long.valueOf(user.getId_user()));
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole().name());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");
            response.setUserId(String.valueOf(user.getId_user()));

        } catch (UsernameNotFoundException | BadCredentialsException e) {
            response.setStatusCode(404);
            response.setMessage("Email or password invalid. Please try again.");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("An error occurred during login. Please try again.");
        }
        return response;
    }


    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User users = usersRepo.findByEmail(ourEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                String newToken = jwtUtils.generateToken(users, Long.valueOf(users.getId_user()));

                response.setStatusCode(200);
                response.setToken(newToken);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            } else {
                response.setStatusCode(401);
                response.setMessage("Invalid or expired refresh token.");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error refreshing token: " + e.getMessage());
        }
        return response;
    }

    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<User> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            User usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, User updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getUsername());
                existingUser.setRole(updatedUser.getRole());

                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                User savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }



    public ReqRes forgotPassword(String email) {
        Optional<User> userOptional = usersRepo.findByEmail(email);

        ReqRes response = new ReqRes();
        if (!userOptional.isPresent()) {
            response.setStatusCode(404);
            response.setMessage("User not found");
            return response;
        }

        User user = userOptional.get();
        String newPassword = generateRandomPassword();
        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepo.save(user);

        response.setStatusCode(200);
        response.setMessage("Password reset successfully");
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPassword(newPassword);

        // Send email
        String subject = "Password Reset Notification";
        String text = "Dear " + user.getUsername() + ",\n\nYour password has been reset successfully. " +
                "Here are your new credentials:\n\n" +
                "Email: " + user.getEmail() + "\n" +
                "Password: " + newPassword + "\n\n" +
                "Please keep this information safe.\n\nBest Regards,\nYour Company";
        emailService.sendSimpleMessage(user.getEmail(), subject, text);

        return response;
    }

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }

        return password.toString();
    }
    public boolean checkEmailExists(String email) {
        return usersRepo.findByEmail(email).isPresent();
    }


    public void revokeRefreshToken(String refreshToken) {
        System.out.println("service token check y khalil : " + refreshToken );
        RevokedToken revokedToken = new RevokedToken(refreshToken, Instant.now());
        revokedTokenRepository.save(revokedToken);
        new ReqRes(HttpStatus.OK, "Token revoked successfully");
    }

}
