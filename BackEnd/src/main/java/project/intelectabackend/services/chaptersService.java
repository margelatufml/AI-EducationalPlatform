package project.intelectabackend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.intelectabackend.controllers.request.chapterRequest;
import project.intelectabackend.controllers.response.chapterResponse;
import project.intelectabackend.mappers.chaptersMapper;
import project.intelectabackend.repositories.chaptersRepository;
import project.intelectabackend.repositories.classUserRepository;
import project.intelectabackend.repositories.entity.chaptersEntity;
import project.intelectabackend.repositories.entity.classUserEntity;
import project.intelectabackend.repositories.entity.subjectEntity;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.subjectRepository;
import project.intelectabackend.repositories.userRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class chaptersService {
    private final chaptersRepository chaptersRepository;
    private final subjectRepository subjectRepository;
    private final classUserRepository classUserRepository;
    private final chaptersMapper chaptersMapper;
    private final userRepository userRepository;

    public List<chapterResponse> getAllChapters() {
        List<chaptersEntity> chapters = chaptersRepository.findAll();
        return chapters.stream()
                .map(chaptersMapper::fromEntity)
                .collect(Collectors.toList());
    }

    public chapterResponse getChapterById(UUID chapterId) {
        chaptersEntity chapterEntity = chaptersRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Not found!"));
        return chaptersMapper.fromEntity(chapterEntity);
    }

    public chapterResponse createChapter(chapterRequest chapterRequest) {

        classUserEntity classUser = classUserRepository.getReferenceById(chapterRequest.getClassId());

        subjectEntity subject = subjectRepository.getReferenceById(chapterRequest.getSubjectId());
        chaptersEntity chapterEntity = chaptersEntity.builder()
                .name(chapterRequest.getName())
                .subject(subject)
                .classUser(classUser)
                .build();

        chapterEntity = chaptersRepository.save(chapterEntity);
        return chaptersMapper.fromEntity(chapterEntity);
    }

    public chapterResponse updateChapter(UUID chapterId, chapterRequest chapterRequest) {
        chaptersEntity existingChapter = chaptersRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Not found!"));

        existingChapter.setName(chapterRequest.getName());

        subjectEntity subject = subjectRepository.getReferenceById(chapterRequest.getSubjectId());

        classUserEntity classUser = classUserRepository.getReferenceById(chapterRequest.getClassId());

        existingChapter.setSubject(subject);
        existingChapter.setClassUser(classUser);

        existingChapter = chaptersRepository.save(existingChapter);

        return chaptersMapper.fromEntity(existingChapter);
    }

    public Boolean deleteChapter(UUID chapterId) {
        if (chaptersRepository.existsById(chapterId)) {
            chaptersRepository.deleteById(chapterId);
            return true;
        } else {
            return false;
        }
    }


    public List<chapterResponse> getChaptersFinishByUserId(UUID userId, UUID id) {
        List<chaptersEntity> chapters = chaptersRepository.findAll();

        return chapters.stream()
                .filter(chapter -> chapter.getSubject().getId().equals(id))
                .filter(chapter -> chapter.getUsersFinish().stream().anyMatch(user -> user.getId().equals(userId)))
                .filter(chapter -> chapter.getUsersFinish().stream().anyMatch(user -> user.getClassUser().getId().equals(chapter.getClassUser().getId())))
                .map(chaptersMapper::fromEntity)
                .collect(Collectors.toList());
    }


    public List<chapterResponse> getChaptersStartedByUserId(UUID userId, UUID id) {
        List<chaptersEntity> chapters = chaptersRepository.findAll();
        return chapters.stream()
                .filter(chapter -> chapter.getSubject().getId().equals(id))
                .filter(chapter -> chapter.getUsersStarted().stream().anyMatch(user -> user.getId().equals(userId)))
                .filter(chapter -> chapter.getUsersStarted().stream().anyMatch(user -> user.getClassUser().getId().equals(chapter.getClassUser().getId())))
                .map(chaptersMapper::fromEntity)
                .collect(Collectors.toList());
    }



    public BigDecimal calculateCompletedPercentage(UUID userId, UUID id1) {
        UUID id;
        userEntity user = userRepository.getReferenceById(userId);

        if(user.getRole().equals("PARENT"))
        {
            id=user.getStudent();
        }
        else
        {
            id=userId;
        }

        List<chapterResponse> chaptersFinished = getChaptersFinishByUserId(id, id1);
        int totalChapters = chaptersRepository.findAll().size();
        int completedChapters = chaptersFinished.size();

        return BigDecimal.valueOf(completedChapters).divide(BigDecimal.valueOf(totalChapters), 2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateRemainingPercentage(UUID userId, UUID id1) {
        UUID id;
        userEntity user = userRepository.getReferenceById(userId);

        if(user.getRole().equals("PARENT"))
        {
            id=user.getStudent();
        }
        else
        {
            id=userId;
        }

        List<chapterResponse> chaptersStarted = getChaptersStartedByUserId(id, id1);
        int totalChapters = chaptersRepository.findAll().size();
        int startedChapters = chaptersStarted.size();

        return BigDecimal.valueOf(startedChapters).divide(BigDecimal.valueOf(totalChapters), 2, RoundingMode.HALF_UP);
    }

}
