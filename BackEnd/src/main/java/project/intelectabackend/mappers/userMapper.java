package project.intelectabackend.mappers;

import org.mapstruct.Mapper;
import project.intelectabackend.controllers.response.userResponse;
import project.intelectabackend.repositories.entity.userEntity;

@Mapper
public interface userMapper {

    userResponse fromEntity(userEntity userEntity);

}
