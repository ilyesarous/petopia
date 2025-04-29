package tn.esprit.petopia_backend.repositories.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.matching.BlockedUser;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.List;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {
    @Query("SELECT bu.blocked FROM BlockedUser bu WHERE bu.blocker = :blocker")
    List<User> findBlockedUsersByBlocker(@Param("blocker") User blocker);

    boolean existsByBlockerAndBlocked(User blocker, User blocked);

    void deleteByBlockerAndBlocked(User blocker, User blocked);

    @Query("SELECT bu.blocked.id_user FROM BlockedUser bu WHERE bu.blocker.id_user = :blockerId " +
            "UNION SELECT bu.blocker.id_user FROM BlockedUser bu WHERE bu.blocked.id_user = :blockerId")
    List<Integer> findBlockedUserIds(@Param("blockerId") Integer blockerId);
}
