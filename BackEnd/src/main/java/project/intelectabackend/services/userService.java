package project.intelectabackend.services;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.intelectabackend.controllers.request.addClassUser;
import project.intelectabackend.controllers.request.addParentRequest;
import project.intelectabackend.controllers.request.userRequest;
import project.intelectabackend.controllers.response.userResponse;
import project.intelectabackend.mappers.userMapper;
import project.intelectabackend.repositories.chaptersRepository;
import project.intelectabackend.repositories.classUserRepository;
import project.intelectabackend.repositories.entity.chaptersEntity;
import project.intelectabackend.repositories.entity.classUserEntity;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.userRepository;
import project.intelectabackend.services.exception.InvalidUserException;
import project.intelectabackend.services.exception.UpdatingUser;
import project.intelectabackend.services.exception.UserNotFound;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class userService {
    private final userRepository userRepository;
    private final classUserRepository classUserRepository;
    private final userMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final chaptersRepository chaptersRepository;

    public List<userResponse> getAll() {
        List<userEntity> users = userRepository.findAll();
        return users.stream()
                .map(userMapper::fromEntity)
                .toList();
    }

    public userResponse getUserById(UUID id) {
        userEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFound(id));

//        if(userEntity.getLives() <= 10 && userEntity.getLives() >= 0)
//        {
//            UUID chapterId = userEntity.getChaptersStarted().get(0).getId();
//
//            LocalDateTime now = LocalDateTime.now();
//            Map<UUID, LocalDateTime> lastErrorTimes = userEntity.getLastErrorTimes();
//            LocalDateTime lastErrorTime = lastErrorTimes.getOrDefault(chapterId, now.minusYears(1));
//            long timeSinceLastError = ChronoUnit.SECONDS.between(lastErrorTime, now);
//
//            if (timeSinceLastError >= 43200) {
//                userEntity.setLives(10);
//            } else if (timeSinceLastError >= 1800) {
//                userEntity.setLives(userEntity.getLives() + 1);
//            }
//            userRepository.save(userEntity);
//        }

        return userMapper.fromEntity(userEntity);
    }


    public void deleteUser(UUID id) {
        try {
            userRepository.deleteById( id);

        } catch (Exception e) {
            throw new RuntimeException("Error deleting user.");
        }
    }

    public userResponse updateUser(UUID userId, userRequest userRequest) {

        Optional<userEntity> existingUserOptional = userRepository.findById(userId);

        if (existingUserOptional.isPresent()) {
            userEntity existingUser = existingUserOptional.get();

            existingUser.setFirstName(userRequest.getFirstName());
            existingUser.setLastName(userRequest.getLastName());
            existingUser.setEmail(userRequest.getEmail());
            existingUser.setPicture(userRequest.getPicture());
            existingUser.setProcess(userRequest.getProcess());
            try {
                existingUser = userRepository.save(existingUser);

            } catch (Exception e) {
                throw new UpdatingUser();
            }

            return userMapper.fromEntity(existingUser);
        } else {
            throw new UserNotFound(userId);
        }
    }

    public boolean addParent (UUID id, addParentRequest addParentRequest){

        userEntity userEntity1 = new userEntity();
        userEntity1.setFirstName(addParentRequest.getFirstName());
        userEntity1.setLastName(addParentRequest.getLastName());
        if (!userRepository.existsByEmail(addParentRequest.getEmail())) {
            userEntity1.setEmail(addParentRequest.getEmail());
        }
        else {
            throw new InvalidUserException("EMAIL_ALREADY_EXISTS");
        }

        String encodedPassword = passwordEncoder.encode(addParentRequest.getPassword());

        userEntity1.setPassword(encodedPassword);
        userEntity1.setRole("PARENT");
        userEntity1.setStudent(id);
        userEntity1.setClassUser(null);
        userEntity1.setLives(0);
        userEntity1.setPoints(0);

        try{

            Optional<userEntity> userEntity = userRepository.findById(id);
            userEntity userEntity2 = userEntity.get();
            if(userEntity2.getParent1()==null || userEntity2.getParent2()==null)
                userEntity1=userRepository.save(userEntity1);

            if(userEntity2.getParent1()==null) {
                userEntity2.setParent1(userEntity1.getId());
                userRepository.save(userEntity2);
                return true;
            }
            else if(userEntity2.getParent2()==null) {
                userEntity2.setParent2(userEntity1.getId());
                userRepository.save(userEntity2);
                return true;
            }
            else
            {
                return false;
            }
        }catch (Exception e)
        {
            throw new UpdatingUser();
        }
    }

    public userResponse getUserForParent(UUID userId) {
        try{
            userEntity userEntity = userRepository.findById(userId).get();
            userEntity userEntity1 = userRepository.findById(userEntity.getStudent()).get();
            return userMapper.fromEntity(userEntity1);
        }catch (Exception e)
        {
            throw new UserNotFound(userId);
        }
    }

    public boolean setClassForUser (UUID id, addClassUser addClassUser){
        try{
            userEntity userEntity = userRepository.findById(id).get();
            classUserEntity classUser = classUserRepository.findByClassNumber(addClassUser.getNumber());

            List<chaptersEntity> existingChapters = userEntity.getChaptersStarted();
            for (chaptersEntity chapter : existingChapters) {

                chapter.getUsersStarted().removeIf(user -> user.getId().equals(id));

                chaptersRepository.save(chapter);
            }
            List<chaptersEntity> chaptersEntities = chaptersRepository.findAllByClassUser_Id(classUser.getId());
            userEntity.setClassUser(classUser);

            for (chaptersEntity chapter : chaptersEntities) {
                chapter.getUsersStarted().add(userEntity);
                chaptersRepository.save(chapter);
            }
            userEntity= userRepository.save(userEntity);

            return userEntity.getClassUser().getClassNumber() == addClassUser.getNumber();
        }catch (Exception e) {
            throw new UpdatingUser();
        }
    }
}
