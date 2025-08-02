package project.intelectabackend.repositories.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.UUID;
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "subject")
public class subjectEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name="id")
    private UUID id;
    @Column(name="name")
    private String name;
    @Column(name="chapters")
    @OneToMany(mappedBy = "subject")
    private List<chaptersEntity> chapters;

    @JoinColumn(name="user")
    @ManyToOne
    private userEntity user;
}
