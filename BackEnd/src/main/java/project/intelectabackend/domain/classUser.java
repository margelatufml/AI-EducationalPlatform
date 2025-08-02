package project.intelectabackend.domain;

import lombok.Data;

import java.util.UUID;
@Data
public class classUser {
    private UUID id;
    private int classNumber;
    private String profil;
}
