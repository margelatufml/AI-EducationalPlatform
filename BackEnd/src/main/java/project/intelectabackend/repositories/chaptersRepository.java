package project.intelectabackend.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.intelectabackend.repositories.entity.chaptersEntity;
import project.intelectabackend.repositories.entity.userEntity;

import java.util.List;
import java.util.UUID;

public interface chaptersRepository extends JpaRepository<chaptersEntity, UUID> {
    List<chaptersEntity> findAllByClassUser_Id(UUID classUser);
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO chapter_user_started (chapter_id, user_id) " +
            "SELECT c.id, :userId FROM chapters c " +
            "WHERE c.class_number = :classUserId " +
            "AND NOT EXISTS (SELECT 1 FROM chapter_user_started cu " +
            "WHERE cu.chapter_id = c.id AND cu.user_id = :userId)",
            nativeQuery = true)
    void addUserToChapters(@Param("classUserId") UUID classUserId, @Param("userId") UUID userId);

}

