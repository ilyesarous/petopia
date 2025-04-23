package tn.esprit.petopia_backend.controller.user;


import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.dto.*;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.security.JWTUtils;
import tn.esprit.petopia_backend.services.notif.NotificationService;
import tn.esprit.petopia_backend.services.user.EmailService;
import tn.esprit.petopia_backend.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService usersManagementService;
    @Autowired
    private UserRepository userRepository;


    @Autowired
    private final NotificationService notificationService;


    @Autowired
    private JWTUtils jwtUtils;

    public UserController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg) throws MessagingException {
        ReqRes response = usersManagementService.register(reg);
        String userId = response.getUserId();
        if (response.getStatusCode() == 200) {
            String subject = "Welcome to Petopia";
            String htmlContent = usersManagementService.getHtmlTemplate(reg.getName(), reg.getEmail(), reg.getPassword(), userId);
            emailService.sendHtmlMessage(reg.getEmail(), subject, htmlContent);
            SignupNotification notification = new SignupNotification(
                    reg.getUserId(),
                    reg.getName(),
                    reg.getEmail(),
                    new Date()
            );
            notificationService.notifyNewSignup(notification);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String userId) {
        Optional<User> userOpt = userRepository.findById(Integer.parseInt(userId));
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLocked(true);
            userRepository.save(user);
            return ResponseEntity.ok("Your account has been activated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }



    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
        ReqRes response = usersManagementService.login(req);

        if (response.getStatusCode() == 200) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }
    }


    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/user/get-user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN','ROLE_PARTNER','ROLE_SHELTER')")
    public ResponseEntity<ReqRes> getuserByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody User reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<ReqRes> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        ReqRes response = usersManagementService.forgotPassword(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("/auth/check-email-exists")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = usersManagementService.checkEmailExists(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/auth/vets")
    public List<User> getAllVeterinarians() {
        return usersManagementService.getAllVets();
    }

    @GetMapping("/auth/retrive-All-users")
    public ResponseEntity<ReqRes> retriveAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }


}
