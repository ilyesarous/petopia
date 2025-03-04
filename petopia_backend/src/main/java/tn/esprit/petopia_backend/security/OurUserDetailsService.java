package tn.esprit.petopia_backend.security;

import tn.esprit.petopia_backend.entities.user.UserRole;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

//a bridge between the Spring Security framework and the application's user data storage
@Service
public class OurUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository usersRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usersRepo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }



    public List<User> getAllUsers() {
        return usersRepo.findByRole(UserRole.USER);
    }



}