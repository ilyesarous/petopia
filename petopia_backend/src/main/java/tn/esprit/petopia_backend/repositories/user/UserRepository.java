package tn.esprit.petopia_backend.repositories.user;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.user.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findAllByRole(UserRole role);

    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findById(Integer id); // This will allow us to fetch the user by their ID

    @Query("SELECT u FROM User u WHERE u.shelter.id = :shelterId")
    List<User> findUsersByShelterId(@Param("shelterId") Integer shelterId);

}
