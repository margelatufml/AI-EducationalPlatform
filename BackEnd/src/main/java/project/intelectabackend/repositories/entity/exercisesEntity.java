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
@Table(name = "exercises")
public class exercisesEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name="id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name="chapterId")
    private chaptersEntity chapter;

    @Lob
    @Column(name="content")
    private String content;

    @Lob
    @Column(name="answer")
    private String answer;

    @Column(name="points")
    private int points;

    @Column(name="type")
    private String type;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "exercise_steps",
            joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "step_content")
    private List<String> steps;
}
