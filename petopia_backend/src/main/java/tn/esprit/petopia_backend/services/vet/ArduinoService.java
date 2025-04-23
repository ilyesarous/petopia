package tn.esprit.petopia_backend.services.vet;

import com.fazecast.jSerialComm.SerialPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ArduinoService {

    private SerialPort serialPort;
    private volatile boolean connected = false;

    @Value("${arduino.port:COM4}")
    private String portName;

    @Value("${arduino.baud-rate:9600}")
    private int baudRate;

    private final PetRepository petRepository;


    @PostConstruct
    public void initialize() {
        log.info("Initialisation de la connexion Arduino...");
        log.info("Configuration: Port={}, BaudRate={}", portName, baudRate);

        SerialPort[] ports = SerialPort.getCommPorts();
        logAvailablePorts(ports);

        if (ports.length == 0) {
            log.error("Aucun port série détecté !");
            return;
        }

        // Tentative de connexion sur le port configuré
        for (SerialPort port : ports) {
            if (port.getSystemPortName().equalsIgnoreCase(portName)) {
                if (tryConnect(port)) {
                    startReadingThread();
                    return;
                }
            }
        }

        // Fallback: Recherche automatique d'Arduino
        for (SerialPort port : ports) {
            if (isLikelyArduinoPort(port)) {
                if (tryConnect(port)) {
                    startReadingThread();
                    return;
                }
            }
        }

        log.warn("⚠️ Aucun Arduino détecté ou connecté !");
    }

    @PreDestroy
    public void cleanup() {
        if (connected && serialPort != null) {
            log.info("Fermeture du port série...");
            serialPort.closePort();
            connected = false;
        }
    }

    private void logAvailablePorts(SerialPort[] ports) {
        log.info("=== Ports série disponibles ===");
        for (SerialPort port : ports) {
            log.info("{} - {}", port.getSystemPortName(), port.getDescriptivePortName());
        }
    }

    private boolean isLikelyArduinoPort(SerialPort port) {
        String desc = port.getDescriptivePortName().toLowerCase();
        return desc.contains("arduino") || desc.contains("usb serial") || desc.contains("ch340");
    }

    private boolean tryConnect(SerialPort port) {
        try {
            log.info("Tentative de connexion sur {}", port.getSystemPortName());
            this.serialPort = port;
            serialPort.setBaudRate(baudRate);
            serialPort.setComPortTimeouts(
                    SerialPort.TIMEOUT_READ_SEMI_BLOCKING,
                    1000,
                    0
            );

            if (serialPort.openPort()) {
                connected = true;
                log.info("✅ Connecté avec succès à Arduino sur {}", port.getSystemPortName());
                return true;
            } else {
                log.error("Échec d'ouverture du port {}", port.getSystemPortName());
            }
        } catch (Exception e) {
            log.error("Erreur de connexion sur {}: {}", port.getSystemPortName(), e.getMessage());
        }
        return false;
    }



    public void sendToArduino(String message) {
        if (!connected) {
            log.warn("Arduino non connecté - message non envoyé: {}", message);
            return;
        }

        try {
            byte[] buffer = (message + "\n").getBytes(StandardCharsets.UTF_8);
            int bytesWritten = serialPort.writeBytes(buffer, buffer.length);
            log.debug("Message envoyé à Arduino: {} ({} bytes)", message, bytesWritten);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi à Arduino: {}", e.getMessage());
        }
    }

    public boolean isConnected() {
        return connected;
    }

    public String getSerialPortInfo() {
        if (!connected) return "Non connecté";

        StringBuilder sb = new StringBuilder();
        sb.append("Connecté sur: ").append(serialPort.getSystemPortName()).append("\n");
        sb.append("Baud rate: ").append(serialPort.getBaudRate()).append("\n");
        sb.append("Statut: ").append(serialPort.isOpen() ? "Ouvert" : "Fermé");
        return sb.toString();
    }



    private void processArduinoRequest(String request) {
        try {
            // Extraire le code de la requête
            String[] parts = request.split("/");
            String code = parts[parts.length - 1].split(" ")[0];
            log.info("Code extrait: {}", code);

            // Simuler le traitement
            Optional<Pet> petOpt = petRepository.findByPetRefVet(Integer.parseInt(code));

            if (petOpt.isPresent()) {
                Pet pet = petOpt.get();
                String response = "WELCOME:" + pet.getPetName();
                sendToArduino(response);
                log.info("Réponse envoyée à Arduino: {}", response);
            } else {
                sendToArduino("INVALID");
                log.warn("Code invalide reçu: {}", code);
            }
        } catch (Exception e) {
            log.error("Erreur lors du traitement de la requête Arduino", e);
            sendToArduino("ERROR");
        }
    }

    private void startReadingThread() {
        new Thread(() -> {
            log.info("Démarrage du thread de lecture série...");
            StringBuilder buffer = new StringBuilder();

            while (connected) {
                try {
                    if (serialPort.bytesAvailable() > 0) {
                        byte[] readBuffer = new byte[serialPort.bytesAvailable()];
                        int numRead = serialPort.readBytes(readBuffer, readBuffer.length);
                        String received = new String(readBuffer, 0, numRead, StandardCharsets.UTF_8);
                        buffer.append(received);

                        // Vérifier si nous avons une ligne complète
                        int newLineIndex;
                        while ((newLineIndex = buffer.indexOf("\n")) >= 0) {
                            String line = buffer.substring(0, newLineIndex).trim();
                            buffer.delete(0, newLineIndex + 1);

                            log.info("Message complet reçu d'Arduino: {}", line);
                            processArduinoMessage(line);
                        }
                    }
                    Thread.sleep(100);
                } catch (Exception e) {
                    log.error("Erreur dans le thread de lecture: {}", e.getMessage());
                }
            }
        }).start();
    }

    private void processArduinoMessage(String message) {
        try {
            // Gérer les deux formats possibles
            String code;
            if (message.startsWith("CODE:")) {
                code = message.substring(5);
            } else if (message.matches("\\d+")) {
                code = message;
            } else {
                log.warn("Format de message non reconnu: {}", message);
                sendToArduino("ERROR:FORMAT");
                return;
            }

            log.info("Traitement du code: {}", code);

            // Ajoutez une vérification de null
            if (petRepository == null) {
                log.error("petRepository est null!");
                sendToArduino("ERROR:REPOSITORY");
                return;
            }

            Optional<Pet> petOpt = petRepository.findByPetRefVet(Integer.parseInt(code));

            if (petOpt.isPresent()) {
                Pet pet = petOpt.get();
                String response = "WELCOME:" + pet.getPetName();
                sendToArduino(response);
                log.info("Réponse envoyée: {}", response);
            } else {
                sendToArduino("INVALID");
                log.warn("Code invalide: {}", code);
            }
        } catch (NumberFormatException e) {
            log.error("Code non numérique: {}", message);
            sendToArduino("ERROR:NUMBER");
        } catch (Exception e) {
            log.error("Erreur traitement message", e);
            sendToArduino("ERROR:UNKNOWN");
        }
    }

}