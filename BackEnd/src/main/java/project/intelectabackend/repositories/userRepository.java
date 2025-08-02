package project.intelectabackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.intelectabackend.repositories.entity.userEntity;

import java.util.UUID;

public interface userRepository extends JpaRepository<userEntity, UUID> {
    boolean existsByEmail(String email);
    userEntity findByEmail(String username);
}
