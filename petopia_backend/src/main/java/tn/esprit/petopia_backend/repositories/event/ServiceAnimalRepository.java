package tn.esprit.petopia_backend.repositories.event;

import org.apache.catalina.mbeans.ServiceMBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;

@Repository
public interface ServiceAnimalRepository  extends JpaRepository<ServiceAnimal,Long> {
}
