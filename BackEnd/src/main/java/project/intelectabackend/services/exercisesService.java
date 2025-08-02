package project.intelectabackend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.intelectabackend.controllers.request.exercisesRequest;
import project.intelectabackend.controllers.response.exerciseWithWaitTimeResponse;
import project.intelectabackend.controllers.response.exercisesResponse;
import project.intelectabackend.mappers.exercisesMapper;
import project.intelectabackend.repositories.chaptersRepository;
import project.intelectabackend.repositories.entity.chaptersEntity;
import project.intelectabackend.repositories.entity.exercisesEntity;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.entity.userProgressEntity;
import project.intelectabackend.repositories.exercisesRepository;
import project.intelectabackend.repositories.userProgressRepository;
import project.intelectabackend.repositories.userRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class exercisesService {
    private final exercisesRepository exercisesRepository;
    private final chaptersRepository chaptersRepository;
    private final exercisesMapper exercisesMapper;
    private final userProgressRepository userProgressRepository;
    private final userRepository userRepository;

    public exercisesResponse createExercises(exercisesRequest exercisesRequest) {
        chaptersEntity chapters = chaptersRepository.findById(exercisesRequest.getChapterId())
                .orElseThrow(() -> new RuntimeException("Not found!"));

        exercisesEntity exerciseEntity = exercisesEntity.builder()
                .answer(exercisesRequest.getAnswer())
                .type(exercisesRequest.getType())
                .content(exercisesRequest.getContent())
                .chapter(chapters)
                .steps(exercisesRequest.getSteps())
                .build();

        List<exercisesEntity> exercises = chapters.getExercises();
        exercises.add(exerciseEntity);
        chapters.setExercises(exercises);
        chaptersRepository.save(chapters);

        return getExercisesResponse(exercisesRequest, exerciseEntity);
    }

    private exercisesResponse getExercisesResponse(exercisesRequest exercisesRequest, exercisesEntity exerciseEntity) {
        switch (exercisesRequest.getType()) {
            case "easy" -> exerciseEntity.setPoints(5);
            case "medium" -> exerciseEntity.setPoints(10);
            case "hard" -> exerciseEntity.setPoints(15);
        }
        try {
            exerciseEntity = exercisesRepository.save(exerciseEntity);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return exercisesMapper.fromEntity(exerciseEntity);
    }

    public Boolean deleteExercises(UUID exerciseId) {
        if (exercisesRepository.existsById(exerciseId)) {
            exercisesRepository.deleteById(exerciseId);
            return true;
        } else {
            return false;
        }
    }

    public exercisesResponse getExercisesById(UUID exerciseId) {
        exercisesEntity exerciseEntity = exercisesRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Not found!"));
        return exercisesMapper.fromEntity(exerciseEntity);
    }

    public exercisesResponse updateExercises(UUID exerciseId, exercisesRequest exercisesRequest) {
        exercisesEntity exerciseEntity = exercisesRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Not found!"));

        chaptersEntity chapters = chaptersRepository.findById(exercisesRequest.getChapterId())
                .orElseThrow(() -> new RuntimeException("Not found!"));

        exerciseEntity.setAnswer(exercisesRequest.getAnswer());
        exerciseEntity.setContent(exercisesRequest.getContent());
        exerciseEntity.setType(exercisesRequest.getType());
        exerciseEntity.setChapter(chapters);
        exerciseEntity.setSteps(exercisesRequest.getSteps());

        return getExercisesResponse(exercisesRequest, exerciseEntity);
    }

    public exerciseWithWaitTimeResponse getExercises(UUID userId, UUID chapterId) {
        try {
            userEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getLives() >= 1) {
                List<userProgressEntity> userProgress = userProgressRepository.findByUserIdAndChapterId(userId, chapterId);
                List<exercisesEntity> exercises = exercisesRepository.getExercisesForChapter(chapterId);

                if (userProgress != null && !userProgress.isEmpty()) {
                    Collections.shuffle(exercises);
                    for (exercisesEntity exercise : exercises) {
                        boolean isExerciseInUserProgress = userProgress.stream()
                                .anyMatch(up -> up.getExercises().getId().equals(exercise.getId()));
                        if (!isExerciseInUserProgress) {
                            return new exerciseWithWaitTimeResponse(exercisesMapper.fromEntity(exercise), "0");
                        }
                    }
                } else {
                    Collections.shuffle(exercises);
                    exercisesEntity randomExercise = exercises.get(0);
                    return new exerciseWithWaitTimeResponse(exercisesMapper.fromEntity(randomExercise), "0");
                }
            } else {
                String formattedRemainingTime = getRemainingTime(userId);
                return new exerciseWithWaitTimeResponse(exercisesMapper.fromEntity(new exercisesEntity()), formattedRemainingTime);
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


//    public String getRemainingTime(UUID userId, UUID chapterId) {
//        try {
//            userEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//            if (user.getLives() <= 10 && user.getLives() >= 0) {
//                LocalDateTime now = LocalDateTime.now();
//                Map<UUID, LocalDateTime> lastErrorTimes = user.getLastErrorTimes();
//                LocalDateTime lastErrorTime = lastErrorTimes.getOrDefault(chapterId, now.minusYears(1));
//                long timeSinceLastError = ChronoUnit.SECONDS.between(lastErrorTime, now);
//
//                if (timeSinceLastError >= 43200) {
//                    user.setLives(10);
//                } else if (timeSinceLastError >= 1800) {
//                    user.setLives(user.getLives() + 1);
//                }
//                if (user.getLives() > 10) {
//                    user.setLives(10);
//                }
//                userRepository.save(user);
//
//                long remainingTime = timeSinceLastError - 1800;
//                return formatRemainingTime(remainingTime);
//            }
//            return null;
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
public String getRemainingTime(UUID userId) {
    try {
        userEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getLives() <= 10 && user.getLives() >= 0) {
            LocalDateTime now = LocalDateTime.now();
            Map<UUID, LocalDateTime> lastErrorTimes = user.getLastErrorTimes();
            if (lastErrorTimes == null) {
                return null;
            }

            LocalDateTime lastErrorTime = lastErrorTimes.isEmpty()
                    ? now.minusYears(1)
                    : lastErrorTimes.values().stream()
                    .max(Comparator.naturalOrder())
                    .orElse(now.minusYears(1));

            long timeSinceLastError = ChronoUnit.SECONDS.between(lastErrorTime, now);

            if (timeSinceLastError >= 43200) {
                user.setLives(10);
            } else if (timeSinceLastError >= 1800) {
                user.setLives(user.getLives() + 1);
            }

            if (user.getLives() > 10) {
                user.setLives(10);
            }

            userRepository.save(user);

            long remainingTime = 1800 - timeSinceLastError;
            return formatRemainingTime(remainingTime);
        }

        return null;
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}

    public List<exercisesResponse> getAllExercices() {
        List<exercisesEntity> chapters = exercisesRepository.findAll();
        return chapters.stream()
                .map(exercisesMapper::fromEntity)
                .collect(Collectors.toList());
    }

    public String formatRemainingTime(long seconds) {
        long minutes = seconds / 60;
        long remainingSeconds = seconds % 60;
        return (seconds >= 0 ? "+" : "-") + String.format("%02d:%02d", minutes, remainingSeconds);
    }

}
