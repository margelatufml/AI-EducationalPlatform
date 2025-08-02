package project.intelectabackend.configuration.serialization;

import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import project.intelectabackend.mappers.*;

@Configuration
public class MapperConfig {
    @Bean
    public userMapper userMapper() {
        return Mappers.getMapper(userMapper.class);
    }

    @Bean
    public classUserMapper classUserMapper() {return Mappers.getMapper(classUserMapper.class);}
    @Bean
    public chaptersMapper chaptersMapper() {return Mappers.getMapper(chaptersMapper.class);}

    @Bean
    public subjectMapper subjectMapper() {return Mappers.getMapper(subjectMapper.class);}
//    @Bean
//    public testMapper testMapper() {return Mappers.getMapper(testMapper.class);}

    @Bean
    public exercisesMapper exercicesMapper() {return Mappers.getMapper(exercisesMapper.class);}

    @Bean
    public userProgressMapper userProgressMapper() {return Mappers.getMapper(userProgressMapper.class);}

}
