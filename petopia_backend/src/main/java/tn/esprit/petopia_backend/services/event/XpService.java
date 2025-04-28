package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.user.UserRepository;

@Service
public class XpService {

    private static final int XP_PER_LEVEL = 1000; // XP nécessaire pour monter de niveau

    @Autowired
    private UserRepository userRepository;

    public void addXp(Integer userId, int xpToAdd) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setNb_points(user.getNb_points() + xpToAdd);
        checkLevelUp(user);

        userRepository.save(user);
    }

    private void checkLevelUp(User user) {
        int requiredXp = user.getLevel() * XP_PER_LEVEL;
        if (user.getNb_points() >= requiredXp) {
            user.setLevel(user.getLevel() + 1);
            // Vous pouvez ajouter ici une logique pour récompenser le niveau (coupons, etc.)
        }
    }
}
