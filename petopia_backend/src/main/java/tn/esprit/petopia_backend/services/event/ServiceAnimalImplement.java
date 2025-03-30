package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;
import tn.esprit.petopia_backend.repositories.event.ServiceAnimalRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceAnimalImplement implements IServiceAnimalService {

    @Autowired
    private ServiceAnimalRepository serviceAnimalRepository;
    @Override
    public List<ServiceAnimal> getAllServiceAnimals() {
        return serviceAnimalRepository.findAll();
    }

    @Override
    public Optional<ServiceAnimal> getServiceAnimalById(Long id) {
        return serviceAnimalRepository.findById(id);
    }

    @Override
    public ServiceAnimal createServiceAnimal(ServiceAnimal serviceAnimal) {
        return serviceAnimalRepository.save(serviceAnimal);
    }

    @Override
    public ServiceAnimal updateServiceAnimal(Long id, ServiceAnimal updatedServiceAnimal) {
        return serviceAnimalRepository.findById(id).map(serviceAnimal -> {
            serviceAnimal.setPrixServiceAnimal(updatedServiceAnimal.getPrixServiceAnimal());
            serviceAnimal.setDescriptionServiceAnimal(updatedServiceAnimal.getDescriptionServiceAnimal());
            serviceAnimal.setDisponibilite(updatedServiceAnimal.isDisponibilite());
            serviceAnimal.setTypeService(updatedServiceAnimal.getTypeService());
            return serviceAnimalRepository.save(serviceAnimal);
        }).orElseThrow(() -> new RuntimeException("ServiceAnimal not found"));
    }


    @Override
    public void deleteServiceAnimal(Long id) {
            serviceAnimalRepository.deleteById(id);
    }
}
