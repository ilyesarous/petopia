package tn.esprit.petopia_backend.controller.user;


import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.dto.ReqRes;
import tn.esprit.petopia_backend.services.pet.PetService;
import tn.esprit.petopia_backend.services.user.EmailService;
import tn.esprit.petopia_backend.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService usersManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> regeister(@RequestBody ReqRes reg) {
        ReqRes response = usersManagementService.register(reg);

        if (response.getStatusCode() == 200) {  // Assuming 200 means success
            String subject = "Welcome to Our Platform";
            String text = "Dear " + reg.getName() + ",\n\nYour account has been created successfully. " +
                    "Here are your credentials:\n\n" +
                    "Email: " + reg.getEmail() + "\n" +
                    "Password: " + reg.getPassword() + "\n\n" +
                    "Please keep this information safe.\n\nBest Regards,\nYour Company";
            emailService.sendSimpleMessage(reg.getEmail(), subject, text);
        }

        return ResponseEntity.ok(response);
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
}
