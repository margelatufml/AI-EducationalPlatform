package project.intelectabackend.repositories.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class userEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name="id")
    protected UUID id;

    @Column(name="firstName")
    protected String firstName;

    @Column(name="lastName")
    protected String lastName;

    @Column(name="email")
    protected String email;

    @Column(name="password")
    protected String password;

    @Column(name="role")
    protected String role;

    @Column(name = "parent1")
    protected UUID parent1;

    @Column(name = "parent2")
    protected UUID parent2;

    @Column(name = "student")
    protected UUID student;

    @ManyToOne
    @JoinColumn(name="class_number")
    private classUserEntity classUser;

    @Column(name="points")
    private int points;

    @Column(name="lives")
    private int lives;

    @ElementCollection
    @MapKeyJoinColumn(name="chapter_id")
    @Column(name="strike_count")
    @CollectionTable(name="user_chapter_strikes", joinColumns=@JoinColumn(name="user_id"))
    private Map<UUID, Integer> chapterStrikeCounts;

    @ElementCollection
    @MapKeyJoinColumn(name="chapter_id")
    @Column(name="last_error_time")
    @CollectionTable(name="user_chapter_last_error_times", joinColumns=@JoinColumn(name="user_id"))
    private Map<UUID, LocalDateTime> lastErrorTimes;

    @Column(name="picture", columnDefinition="LONGBLOB")
    private byte[] picture;

    @ManyToMany(mappedBy = "usersStarted")
    private List<chaptersEntity> chaptersStarted;

    @ManyToMany(mappedBy = "usersFinish")
    private List<chaptersEntity> chaptersFinished;

    @Column(name="Learning Process")
    private String process;
}
