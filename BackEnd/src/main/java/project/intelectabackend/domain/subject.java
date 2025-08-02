package project.intelectabackend.domain;

import lombok.Data;

import java.util.List;
import java.util.UUID;
@Data
public class subject {
    private UUID id;
    private String name;
    private List<chapters> chapters;
    private user user;
}
