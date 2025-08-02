package project.intelectabackend.mappers;

import org.mapstruct.Mapper;
import project.intelectabackend.controllers.response.subjectResponse;
import project.intelectabackend.repositories.entity.subjectEntity;

@Mapper
public interface subjectMapper {
    subjectResponse fromEntity (subjectEntity subjectEntity);
}
