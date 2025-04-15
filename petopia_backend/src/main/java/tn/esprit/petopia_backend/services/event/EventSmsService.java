package tn.esprit.petopia_backend.services.event;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class EventSmsService {
    @Value("ACdb4d61d38a0604c41ebaaa8bcc9a0d1b")
    private String accountSid;

    @Value("25e8d65a29c5031d00ee062a2a789d2b")
    private String authToken;

    @Value("+17173409935")
    private String twilioPhoneNumber;
    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }
    public void sendSms(String toPhoneNumber, String body) {
        try {
            if (toPhoneNumber == null || toPhoneNumber.isEmpty()) {
                System.err.println("Phone number is empty - cannot send SMS");
                return;
            }
            String formattedNumber = formatPhoneNumber(toPhoneNumber);

            Message message = Message.creator(
                    new PhoneNumber(formattedNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    body
            ).create();

            System.out.println("SMS sent to " + formattedNumber + " with SID: " + message.getSid());        } catch (Exception e) {
            System.err.println("Error sending SMS to " + toPhoneNumber + ": " + e.getMessage());
            // Vous pouvez logger l'erreur ou la propager selon vos besoins
        }
    }

    private String formatPhoneNumber(String phoneNumber) {
        // Remove all non-digit characters
        String digitsOnly = phoneNumber.replaceAll("[^0-9]", "");

        // Handle Tunisian numbers (assuming local numbers start with 2, 5, or 9)
        if (digitsOnly.matches("^[259]\\d{7}$")) {
            return "+216" + digitsOnly;
        }

        // Handle international numbers (must start with +)
        if (digitsOnly.matches("^\\+\\d+$")) {
            return digitsOnly;
        }

        throw new IllegalArgumentException("Invalid phone number format: " + phoneNumber);
    }
}
