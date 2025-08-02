//package project.intelectabackend.repositories.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.GenericGenerator;
//
//import java.util.List;
//import java.util.Map;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Entity
//@Getter
//@Setter
//@Builder
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Table(name = "test")
//public class testEntity {
//    @Id
//    @GeneratedValue(generator = "UUID")
//    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
//    @Column(name="id")
//    private UUID id;
//
//    @Column(name = "grade")
//    private Integer grades;
//
//    @ManyToOne
//    @JoinColumn(name="subject")
//    private subjectEntity subject;
//
//    @ElementCollection
//    @CollectionTable(
//            name = "known_chapters",
//            joinColumns = @JoinColumn(name = "test_id")
//    )
//    @MapKeyColumn(name = "chapter_id")
//    @Column(name = "user_id")
//    private Map<UUID, UUID> knownChapters;
//
//    @ElementCollection
//    @CollectionTable(
//            name = "unknown_chapters",
//            joinColumns = @JoinColumn(name = "test_id")
//    )
//    @MapKeyColumn(name = "chapter_id")
//    @Column(name = "user_id")
//    private Map<UUID, UUID> unknownChapters;
//
//    @Column(name="testType", length =  16000)
//    private String testType;
//
//    @Column(name="testAnsType", length =  16000)
//    private String testAnsType;
//
//    @ManyToOne
//    @JoinColumn(name="user_id")
//    private userEntity user;
//
//    public void setKnownChapters(Map<UUID, UUID> knownChapters, UUID userId) {
//        this.knownChapters = knownChapters.entrySet().stream()
//                .collect(Collectors.toMap(Map.Entry::getKey, entry -> userId));
//    }
//
//    public void setUnknownChapters(Map<UUID, UUID> unknownChapters, UUID userId) {
//        this.unknownChapters = unknownChapters.entrySet().stream()
//                .collect(Collectors.toMap(Map.Entry::getKey, entry -> userId));
//    }
//
//}
