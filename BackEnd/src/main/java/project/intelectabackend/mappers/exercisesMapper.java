package project.intelectabackend.mappers;

import org.mapstruct.Mapper;
import project.intelectabackend.controllers.request.exercisesRequest;
import project.intelectabackend.controllers.response.exercisesResponse;
import project.intelectabackend.repositories.entity.exercisesEntity;

import java.util.List;

@Mapper
public interface exercisesMapper {
    exercisesResponse fromEntity(exercisesEntity exercisesEntity);
}
