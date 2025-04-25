package  tn.esprit.petopia_backend.services.user;


import tn.esprit.petopia_backend.dto.UserUpdateDTO;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.event.Coupon;
import tn.esprit.petopia_backend.entities.user.RevokedToken;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.user.UserRole;
import tn.esprit.petopia_backend.repositories.event.CouponRepository;
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
import java.time.LocalDate;
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
    private CouponRepository couponRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=<>?";
    private static final int PASSWORD_LENGTH = 12;
    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        try {
            if (usersRepo.findByEmail(registrationRequest.getEmail()).isPresent()) {
                resp.setStatusCode(400);
                resp.setError("This email is already registered.");
                return resp;
            }
            if (checkPhoneNumberExists(registrationRequest.getPhone_number())) {
                resp.setStatusCode(400);
                resp.setError("This phone number is already registered.");
                return resp;
            }
            User ourUser = new User();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setPhoneNumber(registrationRequest.getPhone_number());
            ourUser.setName(registrationRequest.getName());
            UserRole role = UserRole.valueOf(registrationRequest.getRole().toUpperCase());
            ourUser.setRole(role);
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            User ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId_user() > 0) {
                resp.setOurUsers(ourUsersResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
                resp.setUserId(String.valueOf(ourUsersResult.getId_user()));
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError("Internal Server Error: " + e.getMessage());
        }
        return resp;
    }
    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();
        try {
            System.out.println("Login Request: " + loginRequest.getEmail());
            System.out.println("Password Provided: " + loginRequest.getPassword());

            var user = usersRepo.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!user.getLocked()) {
                response.setStatusCode(403); // Forbidden status code
                response.setError("This user is not activated. Check your email or contact support.");
                return response;
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                response.setStatusCode(401); // Unauthorized status code
                response.setError("Invalid password. Please try again.");
                return response;
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
            if (user.getShelter() != null) {
                response.setShelter_id(user.getShelter().getId_shelter());
            } else {
                response.setShelter_id(-1); // null
            }
        } catch (UsernameNotFoundException e) {
            response.setStatusCode(404);
            response.setError("User not found.");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError("An error occurred during login. Please try again.");
        }
        return response;
    }
    public String getHtmlTemplate(String name, String email, String password, String userId) {
        String activationUrl = "http://localhost:888/petopia/auth/activate?userId=" + userId; // Change localhost to your domain
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Welcome Email</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f4f4f4;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: 20px auto;\n" +
                "            background-color: #ffffff;\n" +
                "            padding: 20px;\n" +
                "            border-radius: 8px;\n" +
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "        }\n" +
                "        h1 {\n" +
                "            color: #333333;\n" +
                "        }\n" +
                "        p {\n" +
                "            color: #555555;\n" +
                "            line-height: 1.6;\n" +
                "        }\n" +
                "        .credentials {\n" +
                "            background-color: #f9f9f9;\n" +
                "            padding: 10px;\n" +
                "            border-radius: 4px;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "        .credentials p {\n" +
                "            margin: 5px 0;\n" +
                "        }\n" +
                "        .activate-btn {\n" +
                "            display: inline-block;\n" +
                "            background-color: #4CAF50;\n" +
                "            color: white;\n" +
                "            padding: 10px 20px;\n" +
                "            text-decoration: none;\n" +
                "            border-radius: 5px;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <h1>Welcome to Petopia</h1>\n" +
                "        <p>Dear " + name + ",</p>\n" +
                "        <p>Your account has been created successfully. Here are your credentials:</p>\n" +
                "        <div class=\"credentials\">\n" +
                "            <p><strong>Email:</strong> " + email + "</p>\n" +
                "            <p><strong>Password:</strong> " + password + "</p>\n" +
                "        </div>\n" +
                "        <p>Please click the button below to activate your account:</p>\n" +
                "        <a href=\"" + activationUrl + "\" class=\"activate-btn\">Click here to activate your account</a>\n" +
                "        <p>Best Regards,<br>Petopia</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }


    public boolean checkPhoneNumberExists(String phoneNumber) {
        return usersRepo.findByPhoneNumber(phoneNumber).isPresent();
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

    public ReqRes updateUser(Integer userId, UserUpdateDTO updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isEmpty()) {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
                return reqRes;
            }
            System.out.println("dectect modified user : " + userOptional.get().getEmail());
            String email = updatedUser.getEmail();
            String username = updatedUser.getUsername();
            String phoneNumber = updatedUser.getPhoneNumber();

            User existing = userOptional.get();
            if (email == null || email.isBlank()) email = existing.getEmail();
            if (username == null || username.isBlank()) username = existing.getUsername();
            if (phoneNumber == null || phoneNumber.isBlank()) phoneNumber = existing.getPhoneNumber();

            usersRepo.updateUserInfo(userId, email, username, phoneNumber);
            System.out.println("after modfiied user" + userOptional.get().getEmail());
            Optional<User> updated = usersRepo.findById(userId);
            reqRes.setOurUsers(updated.get());
            reqRes.setStatusCode(200);
            reqRes.setMessage("User updated successfully");
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
    public boolean checkphoneexists(String phone_number) {
        return usersRepo.findByPhoneNumber(phone_number).isPresent();
    }


    public void revokeRefreshToken(String refreshToken) {
        System.out.println("service token check y khalil : " + refreshToken );
        RevokedToken revokedToken = new RevokedToken(refreshToken, Instant.now());
        revokedTokenRepository.save(revokedToken);
        new ReqRes(HttpStatus.OK, "Token revoked successfully");
    }

    public List<User> getAllVets() {
        return usersRepo.findByRole(UserRole.VET);
    }

    public void addXp(Integer userId, int xpToAdd) {
        User user = usersRepo.findById(userId).get();
        System.out.println(user);
        user.setNb_points(user.getNb_points() + xpToAdd);

        // Vérifier si l'utilisateur monte de niveau
        checkLevelUp(user);

        usersRepo.save(user);
    }

    private void checkLevelUp(User user) {
        int xpNeededForNextLevel = user.getLevel() * 100;

        if (user.getNb_points() >= xpNeededForNextLevel) {
            user.setLevel(user.getLevel() + 1);
            user.setNb_points(user.getNb_points() - xpNeededForNextLevel);

            // Générer un coupon pour chaque niveau gagné
            generateCoupon(user);
        }
    }



    private void generateCoupon(User user) {
        Coupon coupon = new Coupon();
        coupon.setCode("COUPON-" + UUID.randomUUID().toString().substring(0, 8));
        coupon.setDiscountPercentage(5 + (user.getLevel() * 2)); // 5% + 2% par niveau
        coupon.setExpirationDate(LocalDate.now().plusMonths(3));
        coupon.setUser(user);

        couponRepository.save(coupon);
        user.getCoupons().add(coupon);
    }


}
