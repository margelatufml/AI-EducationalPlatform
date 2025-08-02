//package project.intelectabackend.mappers;
//
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.Named;
//import project.intelectabackend.controllers.response.testResponse;
//import project.intelectabackend.repositories.entity.testEntity;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Mapper(componentModel = "spring")
//public interface testMapper {
//    @Mapping(source = "entity.id", target = "id")
//    @Mapping(source = "entity.testType", target = "testType")
//    @Mapping(source = "entity.knownChapters", target = "knownChapters", qualifiedByName = "mapKnownChapters")
//    @Mapping(source = "entity.unknownChapters", target = "unknownChapters", qualifiedByName = "mapUnknownChapters")
//    testResponse fromEntity(testEntity entity);
//
//    @Named("mapKnownChapters")
//    default List<UUID> mapKnownChapters(Map<UUID, UUID> knownChapters) {
//        return new ArrayList<>(knownChapters.keySet());
//    }
//
//    @Named("mapUnknownChapters")
//    default List<UUID> mapUnknownChapters(Map<UUID, UUID> unknownChapters) {
//        return new ArrayList<>(unknownChapters.keySet());
//    }
//
//}
