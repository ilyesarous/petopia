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
    @Value("ACe14db7b6c2a28d478ca681ef115606e1")
    private String accountSid;

    @Value("f0dc52545a8f5d61ec7230b9cb4eae8d")
    private String authToken;

    @Value("+16204720295")
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
