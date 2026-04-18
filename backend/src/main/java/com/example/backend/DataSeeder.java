package com.example.backend;

import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.RoleRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(Role.ERole.ROLE_CLIENT);
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName(Role.ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
            
            System.out.println("Roles Seeded.");
        }

        // Seed Admin User
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@vitrineclick.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN).get();
            roles.add(adminRole);
            
            admin.setRoles(roles);
            userRepository.save(admin);
            
            System.out.println("Admin User Seeded! Email: admin@vitrineclick.com | Password: password123");
        }

        // Seed Client User
        if (!userRepository.existsByUsername("user")) {
            User client = new User();
            client.setUsername("user");
            client.setEmail("user@vitrineclick.com");
            client.setPassword(passwordEncoder.encode("password123"));
            
            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_CLIENT).get();
            roles.add(userRole);
            
            client.setRoles(roles);
            userRepository.save(client);
            
            System.out.println("Client User Seeded! Email: user@vitrineclick.com | Password: password123");
        }
    }
}
