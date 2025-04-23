package tn.esprit.petopia_backend.services.user;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
@Service
public class VerificationCodeService {

    private static class CodeData {
        String code;
        LocalDateTime expiry;

        CodeData(String code) {
            this.code = code;
            this.expiry = LocalDateTime.now().plusMinutes(5);
        }

        boolean isExpired() {
            return LocalDateTime.now().isAfter(expiry);
        }
    }

    private final Map<String, CodeData> codeStore = new HashMap<>();

    public void storeCode(String phoneNumber, String code) {
        codeStore.put(phoneNumber, new CodeData(code));
        System.out.println(code);
    }

    public boolean verifyCode(String phoneNumber, String code) {
        CodeData data = codeStore.get(phoneNumber);
        if (data == null || data.isExpired()) {
            return false;
        }
        return data.code.equals(code);
    }

    public void invalidateCode(String phoneNumber) {
        codeStore.remove(phoneNumber);
    }
}