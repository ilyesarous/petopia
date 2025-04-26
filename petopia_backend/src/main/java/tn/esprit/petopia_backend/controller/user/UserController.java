package tn.esprit.petopia_backend.controller.user;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import tn.esprit.petopia_backend.services.user.VerificationCodeService;

import java.util.*;

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
    private PasswordEncoder passwordEncoder;
    @Autowired
    private final NotificationService notificationService;


    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private VerificationCodeService verificationCodeService ;

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

    @PutMapping("/user/update/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<ReqRes> updateUser(
            @PathVariable Integer userId,
            @RequestBody UserUpdateDTO userUpdateDTO
    ) {
        System.out.println("Received userId: " + userId);
        System.out.println("Received DTO: " + userUpdateDTO);
        return ResponseEntity.ok(usersManagementService.updateUser(userId, userUpdateDTO));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<ReqRes> forgotPassword(@RequestBody Map<String, String> request) {
        ReqRes response = new ReqRes();
        String phoneNumber = request.get("phoneNumber");
        try {
            Optional<User> userOptional = userRepository.findByPhoneNumber(phoneNumber);

            if (!userOptional.isPresent()) {  // Changed from user == null
                response.setStatusCode(404);
                response.setMessage("Phone number does not exist");
                return ResponseEntity.status(404).body(response);
            }

            String verificationCode = String.format("%06d", new Random().nextInt(999999));

            verificationCodeService.storeCode(phoneNumber, verificationCode, 10);

            Twilio.init("AC4c5c03086fd0de5d45666acf360d367a", "451c1d5dd414ecc32d9869439b3d5a86");
            Message.creator(
                    new com.twilio.type.PhoneNumber("+216"+phoneNumber),  // Explicitly use com.twilio.type.PhoneNumber
                    new com.twilio.type.PhoneNumber("+17754298646"),
                    "Your password reset code is: " + verificationCode
            ).create();

            response.setStatusCode(200);
            response.setMessage("Verification code sent");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error sending verification code: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<ReqRes> resetPassword(
            @RequestParam String phoneNumber,
            @RequestParam String verificationCode,
            @RequestParam String newPassword) {

        ReqRes response = new ReqRes();
        try {
            if (!verificationCodeService.verifyCode(phoneNumber, verificationCode)) {
                response.setStatusCode(400);
                response.setMessage("Invalid or expired verification code");
                return ResponseEntity.badRequest().body(response);
            }

            Optional<User> userOptional = userRepository.findByPhoneNumber(phoneNumber);
            if (!userOptional.isPresent()) {
                response.setStatusCode(404);
                response.setMessage("User not found");
                return ResponseEntity.status(404).body(response);
            }
            System.out.println(newPassword);
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            verificationCodeService.invalidateCode(phoneNumber);

            response.setStatusCode(200);
            response.setMessage("Password updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error resetting password: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
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
    @GetMapping("/admin/partners")
    public List<User> getAllPartners() {
        return usersManagementService.getAllPartners();
    }

    @GetMapping("/auth/retrive-All-users")
    public ResponseEntity<ReqRes> retriveAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }


}
