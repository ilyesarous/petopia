package tn.esprit.petopia_backend.controller.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.ReqRes;
import tn.esprit.petopia_backend.services.matching.BlockedUserService;

@RestController
@RequestMapping("/api/blocked-users")
public class BlockedUserController {

    @Autowired
    private BlockedUserService blockedUserService;

    @PostMapping("/block/{blockerId}/{blockedId}")
    public ReqRes blockUser(@PathVariable Integer blockerId, @PathVariable Integer blockedId) {
        return blockedUserService.blockUser(blockerId, blockedId);
    }

    @PostMapping("/unblock/{blockerId}/{blockedId}")
    public ReqRes unblockUser(@PathVariable Integer blockerId, @PathVariable Integer blockedId) {
        return blockedUserService.unblockUser(blockerId, blockedId);
    }

    @GetMapping("/{userId}")
    public ReqRes getBlockedUsers(@PathVariable Integer userId) {
        return blockedUserService.getBlockedUsers(userId);
    }
}
