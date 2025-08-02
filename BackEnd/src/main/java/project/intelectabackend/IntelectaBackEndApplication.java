package project.intelectabackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan({"project.intelectabackend.repositories.entity", "project.intelectabackend.domain"})
@EnableJpaRepositories("project.intelectabackend.repositories")
public class IntelectaBackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(IntelectaBackEndApplication.class, args);
    }

}
