package project.intelectabackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import project.intelectabackend.repositories.entity.exercisesEntity;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface exercisesRepository extends JpaRepository<exercisesEntity, UUID> {
    @Query("SELECT DISTINCT e FROM exercisesEntity e WHERE e.chapter.id = :chapterId")
    List<exercisesEntity> getExercisesForChapter(UUID chapterId);

    @Query("SELECT DISTINCT e FROM exercisesEntity e WHERE e.chapter.id = :chapterId AND e.type = :type")
    List<exercisesEntity> getExercisesForChapterAndType(UUID chapterId, String type);

    Collection<Object> findByChapterId(UUID chapterId);
}
