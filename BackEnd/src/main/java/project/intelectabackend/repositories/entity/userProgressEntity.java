package project.intelectabackend.repositories.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "userProgres")
public class userProgressEntity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name="id")
    private UUID id;
    @ManyToOne
    @JoinColumn(name="userId")
    private userEntity user;

    @ManyToOne
    @JoinColumn(name="chapterId")
    private chaptersEntity chapter;

    @ManyToOne
    @JoinColumn(name="exercice_id")
    private exercisesEntity exercises;

    @Column(name="date")
    private Date date;
}
