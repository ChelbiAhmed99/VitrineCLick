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

    @Autowired RoleRepository roleRepository;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // ── Seed Roles ──────────────────────────────────────────────────────
        for (Role.ERole eRole : Role.ERole.values()) {
            if (roleRepository.findByName(eRole).isEmpty()) {
                Role r = new Role();
                r.setName(eRole);
                roleRepository.save(r);
                System.out.println("Role seeded: " + eRole);
            }
        }

        // ── Seed Admin User ─────────────────────────────────────────────────
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@vitrineclick.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setFullName("Administrateur Système");

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(Role.ERole.ROLE_ADMIN).ifPresent(roles::add);
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("Admin seeded: admin@vitrineclick.com / password123");
        }

        // ── Seed Basic Client ───────────────────────────────────────────────
        if (!userRepository.existsByUsername("user")) {
            User client = new User();
            client.setUsername("user");
            client.setEmail("user@vitrineclick.com");
            client.setPassword(passwordEncoder.encode("password123"));
            client.setFullName("Client Basic Test");

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(Role.ERole.ROLE_CLIENT).ifPresent(roles::add);
            client.setRoles(roles);
            userRepository.save(client);
            System.out.println("Basic user seeded: user@vitrineclick.com / password123");
        }

        // ── Seed Pro Client ─────────────────────────────────────────────────
        if (!userRepository.existsByUsername("user_pro")) {
            User pro = new User();
            pro.setUsername("user_pro");
            pro.setEmail("pro@vitrineclick.com");
            pro.setPassword(passwordEncoder.encode("password123"));
            pro.setFullName("Client Pro Test");

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(Role.ERole.ROLE_CLIENT_PRO).ifPresent(roles::add);
            pro.setRoles(roles);
            userRepository.save(pro);
            System.out.println("Pro user seeded: pro@vitrineclick.com / password123");
        }

        // ── Seed Business Client ────────────────────────────────────────────
        if (!userRepository.existsByUsername("user_business")) {
            User biz = new User();
            biz.setUsername("user_business");
            biz.setEmail("business@vitrineclick.com");
            biz.setPassword(passwordEncoder.encode("password123"));
            biz.setFullName("Client Business Test");

            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(Role.ERole.ROLE_CLIENT_BUSINESS).ifPresent(roles::add);
            biz.setRoles(roles);
            userRepository.save(biz);
            System.out.println("Business user seeded: business@vitrineclick.com / password123");
        }
    }
}
