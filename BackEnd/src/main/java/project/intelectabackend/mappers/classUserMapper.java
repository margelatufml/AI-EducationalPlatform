package project.intelectabackend.mappers;

import org.mapstruct.Mapper;
import project.intelectabackend.domain.classUser;
import project.intelectabackend.repositories.entity.classUserEntity;

@Mapper
public interface classUserMapper {
    classUser fromEntity(classUserEntity userEntity);
}
