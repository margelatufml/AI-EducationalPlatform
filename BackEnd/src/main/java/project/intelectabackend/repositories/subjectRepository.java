package project.intelectabackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.intelectabackend.repositories.entity.subjectEntity;

import java.util.UUID;

public interface subjectRepository extends JpaRepository<subjectEntity, UUID> {
}
