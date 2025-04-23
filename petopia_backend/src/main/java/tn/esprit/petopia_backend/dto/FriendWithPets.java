package tn.esprit.petopia_backend.dto;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import java.util.List;

public class FriendWithPets {
    private User user;
    private List<Pet> matchedPets;

    public FriendWithPets(User user, List<Pet> matchedPets) {
        this.user = user;
        this.matchedPets = matchedPets;
    }

    // Getters et setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Pet> getMatchedPets() {
        return matchedPets;
    }

    public void setMatchedPets(List<Pet> matchedPets) {
        this.matchedPets = matchedPets;
    }
}