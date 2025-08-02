package project.intelectabackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.intelectabackend.repositories.entity.classUserEntity;

import java.util.UUID;

public interface classUserRepository extends JpaRepository<classUserEntity, UUID> {
    classUserEntity findByClassNumber(int number);

    classUserEntity findByClassNumberAndProfil(int classNumber, String profil);

}
