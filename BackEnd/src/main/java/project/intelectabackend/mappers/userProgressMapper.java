package project.intelectabackend.mappers;

import org.mapstruct.Mapper;
import project.intelectabackend.controllers.response.GPTResponse;
import project.intelectabackend.controllers.response.userProgressResponse;
import project.intelectabackend.repositories.entity.userProgressEntity;

@Mapper
public interface userProgressMapper {
    userProgressResponse fromEntity(userProgressEntity userProgressEntity);
    String fromEntity1 (userProgressEntity userProgressEntity);
}
