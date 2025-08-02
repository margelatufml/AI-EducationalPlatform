package project.intelectabackend.mappers;

import org.mapstruct.Mapper;
import project.intelectabackend.controllers.response.chapterResponse;
import project.intelectabackend.repositories.entity.chaptersEntity;

@Mapper
public interface chaptersMapper {


 chapterResponse fromEntity (chaptersEntity chaptersEntity);
}
