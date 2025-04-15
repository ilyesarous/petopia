package tn.esprit.petopia_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EnableScheduling
public class PetopiaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetopiaBackendApplication.class, args);
	}

}
