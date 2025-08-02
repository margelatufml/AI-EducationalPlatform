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
@Table(name = "chapters")
public class chaptersEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name="id")
    private UUID id;
    @Column(name="name")
    private String name;

    @ManyToOne
    @JoinColumn(name="subject_id")
    private subjectEntity subject;

    @ManyToOne
    @JoinColumn(name="class_number")
    private classUserEntity classUser;

    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL)
    private List<exercisesEntity> exercises;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "chapter_user_started",
            joinColumns = @JoinColumn(name = "chapter_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<userEntity> usersStarted;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "chapter_user_finished",
            joinColumns = @JoinColumn(name = "chapter_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<userEntity> usersFinish;
}
