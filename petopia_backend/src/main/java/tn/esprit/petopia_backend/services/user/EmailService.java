package tn.esprit.petopia_backend.services.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;



@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendHtmlMessage(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        emailSender.send(message);
    }

    public String getReclamationResponseTemplate(String userName, String reclamationType, String adminResponse) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <style>\n" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; }\n" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n" +
                "        .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }\n" +
                "        .content { margin: 20px 0; }\n" +
                "        .response { background: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; }\n" +
                "        .footer { margin-top: 20px; font-size: 0.9em; color: #7f8c8d; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <h2>Reclamation Update: " + reclamationType + "</h2>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            <p>Dear " + userName + ",</p>\n" +
                "            <p>We have reviewed your reclamation and here is our response:</p>\n" +
                "            <div class=\"response\">\n" +
                "                " + adminResponse + "\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            <p>Best regards,<br>Petopia Support Team</p>\n" +
                "            <p>This is an automated message. Please do not reply directly to this email.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }
}