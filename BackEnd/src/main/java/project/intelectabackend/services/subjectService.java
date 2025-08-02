package project.intelectabackend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.intelectabackend.controllers.request.subjectRequest;
import project.intelectabackend.controllers.response.subjectResponse;
import project.intelectabackend.mappers.subjectMapper;
import project.intelectabackend.repositories.entity.subjectEntity;
import project.intelectabackend.repositories.subjectRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class subjectService {
    private final subjectRepository subjectRepository;
    private final subjectMapper subjectMapper;

    public List<subjectResponse> getAll() {
        List<subjectEntity> subjects = subjectRepository.findAll();
        return subjects.stream()
                .map(subjectMapper::fromEntity)
                .collect(Collectors.toList());
    }

    public subjectResponse getSubjectById(UUID subjectId) {
        subjectEntity subjectEntity = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Not found!"));
        return subjectMapper.fromEntity(subjectEntity);
    }

    public subjectResponse createSubject(subjectRequest subjectRequest) {
       subjectEntity subject = subjectEntity.builder()
               .name(subjectRequest.getName())
               .build();
        subject = subjectRepository.save(subject);
        return subjectMapper.fromEntity(subject);
    }

    public subjectResponse updateSubject(UUID subjectId, subjectRequest subjectRequest) {
        subjectEntity existingSubject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Not found!"));

        existingSubject.setName(subjectRequest.getName());
        existingSubject = subjectRepository.save(existingSubject);

        return subjectMapper.fromEntity(existingSubject);
    }

    public Boolean deleteSubject(UUID chapterId) {
        if (subjectRepository.existsById(chapterId)) {
            subjectRepository.deleteById(chapterId);
            return true;
        } else {
            return false;
        }
    }


}
