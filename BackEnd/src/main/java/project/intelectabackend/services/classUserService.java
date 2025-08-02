package project.intelectabackend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.intelectabackend.controllers.request.addClassUser;
import project.intelectabackend.domain.classUser;
import project.intelectabackend.mappers.classUserMapper;
import project.intelectabackend.repositories.classUserRepository;
import project.intelectabackend.repositories.entity.classUserEntity;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class classUserService {
    private final classUserRepository classUserRepository;
    private final classUserMapper classUserMapper;


    public boolean addClass(addClassUser addClassUser){
        try{
            classUserEntity classUserEntity = new classUserEntity();
            classUserEntity.setClassNumber(addClassUser.getNumber());
            classUserEntity.setProfil(addClassUser.getProfil());

            classUserEntity = classUserRepository.save(classUserEntity);

            return classUserEntity.getClassNumber() == addClassUser.getNumber();
        }catch (Exception e){
            throw new RuntimeException("Error adding the class");
        }
    }

    public boolean updateClass(UUID id, addClassUser addClassUser){
        try{
            classUserEntity classUserEntity = classUserRepository.getReferenceById(id);
            classUserEntity.setClassNumber(addClassUser.getNumber());
            classUserEntity.setProfil(addClassUser.getProfil());
            classUserEntity = classUserRepository.save(classUserEntity);

            return classUserEntity.getClassNumber() == addClassUser.getNumber();
        }catch (Exception e){
            throw new RuntimeException("Error updating the class");
        }
    }

    public List<classUser> getAll() {
        List<classUserEntity> classes = classUserRepository.findAll();
        return classes.stream()
                .map(classUserMapper::fromEntity)
                .toList();
    }

    public void deleteClass(UUID id) {
        try {
            classUserRepository.deleteById( id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user.");
        }
    }
}
