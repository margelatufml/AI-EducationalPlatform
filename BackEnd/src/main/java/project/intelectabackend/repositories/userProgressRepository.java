package project.intelectabackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.intelectabackend.repositories.entity.userProgressEntity;


import java.util.List;
import java.util.UUID;

public interface userProgressRepository extends JpaRepository<userProgressEntity, UUID> {

    @Query("SELECT u FROM userProgressEntity u WHERE u.user.id = :userId")
    List<userProgressEntity> findByUserId(UUID userId);


    @Query("SELECT u.chapter.name, u.user.firstName, u.user.lastName, SUM(e.points) as totalPoints FROM userProgressEntity u JOIN u.exercises e GROUP BY u.chapter.name, u.user.firstName, u.user.lastName ORDER BY totalPoints DESC")
    List<Object[]> findTop3UsersByChapter();

    @Query("SELECT u FROM userProgressEntity u WHERE u.user.id = :userId AND u.chapter.id = :chapterId")
    List<userProgressEntity> findByUserIdAndChapterId(UUID userId, UUID chapterId);

}
