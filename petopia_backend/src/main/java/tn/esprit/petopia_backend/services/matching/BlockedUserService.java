package tn.esprit.petopia_backend.services.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import tn.esprit.petopia_backend.dto.ReqRes;
import tn.esprit.petopia_backend.entities.matching.BlockedUser;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.matching.BlockedUserRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class BlockedUserService {

    @Autowired
    private BlockedUserRepository blockedUserRepository;

    @Autowired
    private UserRepository userRepository;

    public ReqRes blockUser(Integer blockerId, Integer blockedId) {
        ReqRes response = new ReqRes();
        try {
            if (blockerId.equals(blockedId)) {
                response.setStatusCode(400);
                response.setMessage("Cannot block yourself");
                return response;
            }

            User blocker = userRepository.findById(blockerId)
                    .orElseThrow(() -> new RuntimeException("Blocker not found"));
            User blocked = userRepository.findById(blockedId)
                    .orElseThrow(() -> new RuntimeException("Blocked user not found"));

            if (blockedUserRepository.existsByBlockerAndBlocked(blocker, blocked)) {
                response.setStatusCode(400);
                response.setMessage("User is already blocked");
                return response;
            }

            BlockedUser blockedUser = new BlockedUser();
            blockedUser.setBlocker(blocker);
            blockedUser.setBlocked(blocked);
            blockedUserRepository.save(blockedUser);

            response.setStatusCode(200);
            response.setMessage("User blocked successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error blocking user: " + e.getMessage());
        }
        return response;
    }

    @Transactional // Add this annotation
    public ReqRes unblockUser(Integer blockerId, Integer blockedId) {
        ReqRes response = new ReqRes();
        try {
            User blocker = userRepository.findById(blockerId)
                    .orElseThrow(() -> new RuntimeException("Blocker not found"));
            User blocked = userRepository.findById(blockedId)
                    .orElseThrow(() -> new RuntimeException("Blocked user not found"));

            if (!blockedUserRepository.existsByBlockerAndBlocked(blocker, blocked)) {
                response.setStatusCode(400);
                response.setMessage("User is not blocked");
                return response;
            }

            blockedUserRepository.deleteByBlockerAndBlocked(blocker, blocked);

            response.setStatusCode(200);
            response.setMessage("User unblocked successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error unblocking user: " + e.getMessage());
        }
        return response;
    }

    public ReqRes getBlockedUsers(Integer userId) {
        ReqRes response = new ReqRes();
        try {
            User blocker = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<User> blockedUsers = blockedUserRepository.findBlockedUsersByBlocker(blocker);
            response.setOurUsersList(blockedUsers);
            response.setStatusCode(200);
            response.setMessage("Blocked users retrieved successfully");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retrieving blocked users: " + e.getMessage());
        }
        return response;
    }

    public List<Integer> getBlockedUserIds(Integer userId) {
        return blockedUserRepository.findBlockedUserIds(userId);
    }
    /*
    public List<Integer> getBlockedUserIds(Integer userId) {
        // Fetch users blocked by userId and users who blocked userId
        List<Integer> blockedByUser = blockedUserRepository.findBlockedUserIdsByBlocker(userId);
        List<Integer> blockingUser = blockedUserRepository.findBlockerUserIdsByBlocked(userId);
        // Combine and deduplicate
        return Stream.concat(blockedByUser.stream(), blockingUser.stream())
                .distinct()
                .collect(Collectors.toList());
    }*/
}