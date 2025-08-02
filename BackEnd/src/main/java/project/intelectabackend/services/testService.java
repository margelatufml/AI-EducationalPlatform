//package project.intelectabackend.services;
//
//import com.theokanning.openai.completion.chat.ChatCompletionRequest;
//import com.theokanning.openai.completion.chat.ChatMessage;
//import com.theokanning.openai.completion.chat.ChatMessageRole;
//import com.theokanning.openai.service.OpenAiService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import project.intelectabackend.controllers.response.testResponse;
//import project.intelectabackend.mappers.testMapper;
//import project.intelectabackend.repositories.chaptersRepository;
//import project.intelectabackend.repositories.entity.*;
//import project.intelectabackend.repositories.subjectRepository;
//import project.intelectabackend.repositories.testRepository;
//import project.intelectabackend.repositories.userRepository;
//
//import java.time.Duration;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class testService {
//    private final testMapper testMapper;
//    private final chaptersRepository chaptersRepository;
//    private final testRepository testRepository;
//    private final userRepository userRepository;
//    private final subjectRepository subjectRepository;
//
//    @Value("${openai.model3}")
//    private String model3;
//
//
//    @Value("${openai.model4}")
//    private String model4;
//
//    @Value("${openai.api.key}")
//    private String apiKey;
//
//    public testResponse generateTest(UUID id, UUID subjectId, boolean premium) {
//        Optional<userEntity> user = userRepository.findById(id);
//        if (user.isPresent()) {
//
//            subjectEntity subject = subjectRepository.getReferenceById(subjectId);
//            OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(200));
//            classUserEntity classUser = user.get().getClassUser();
//            List<chaptersEntity> chaptersEntities = chaptersRepository.findAllByClassUser_Id(classUser.getId());
//
//            String promptText = "Da-mi un test, de clasa a " + classUser.getClassNumber() + ", pentru fiecare dintre următoarele capitole să îmi dai câte  10 exerciții: " + getChapterNames(chaptersEntities) + ". Exercițiile trebuie să fie corecte, fără greșeli, și cu un nivel de dificultate mediu-ridicat. Nu-mi da rezolvarea, titlurile sau propozițiile care nu sunt utile pentru rezolvarea exercițiilor, și nu folosi prescurtări matematice. Vreau doar exercițiile cu caractere cât mai matematice.";
//
//            ChatMessage userMessage = createUserMessage(promptText);
//
//            ChatCompletionRequest completionRequest = createCompletionRequest(userMessage);
//
//            if(premium)
//            {
//                completionRequest.setModel(model4);
//            }else{
//                completionRequest.setModel(model3);
//            }
//
//            try {
//                String answer = service.createChatCompletion(completionRequest).getChoices().get(0).getMessage().getContent();
//                testEntity test = testEntity.builder()
//                        .testType(answer)
//                        .subject(subject)
//                        .user(user.get())
//                        .build();
//                testRepository.save(test);
//                return testMapper.fromEntity(test);
//            }catch (Exception e){
//                throw new RuntimeException(e);
//            }
//        } else {
//            return null;
//        }
//    }
//
//    public testResponse correctionTest(UUID id, UUID userId, String testRequest, boolean premium) {
//        Optional<testEntity> test = testRepository.findById(id);
//
//        OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(200));
//        classUserEntity classUser = userRepository.getReferenceById(userId).getClassUser();
//        List<chaptersEntity> chaptersEntities = chaptersRepository.findAllByClassUser_Id(classUser.getId());
//        String promptText ="Asta este testul: "+test.get().getTestType()+ ".Asta este rezolvarea mea la acest test: "+testRequest+". Vreau sa imi spui capitolele stiute, si capitole nestiute. Sa imi dai si nota pentru test. Sa iei in considerare numai urmatoarele capitole. Astea sunt capitolele pe care trebuie sa le stiu: "+ getChapterNames(chaptersEntities)+". Sa folosesti -, daca nu sunt capitole de pus in categoria respuctiva si sa folosesti urmatorul patern. Sa raspunzi sub forma asta:Capitole stiute: , \n" +
//                "Capitole nestiute: -\n" +
//                "\n" +
//                "Nota pentru test: /10";
//
//        ChatMessage userMessage = createUserMessage(promptText);
//
//        ChatCompletionRequest completionRequest = createCompletionRequest(userMessage);
//
//        if(premium)
//        {
//            completionRequest.setModel(model4);
//        }else {
//            completionRequest.setModel(model3);
//        }
//
//        try {
//            String answer = service.createChatCompletion(completionRequest).getChoices().get(0).getMessage().getContent();
//
//            UUID answerId =  getAnswer(test.get().getId(), answer, userId);
//
//            assert answerId != null;
//            Optional<testEntity> test1 = testRepository.findById(answerId);
//
//            return testMapper.fromEntity(test1.get());
//        }catch (Exception e){
//                throw new RuntimeException(e);
//        }
//    }
//
//    private UUID getAnswer(UUID testId, String answer, UUID userId) {
//        Optional<testEntity> testOptional = testRepository.findById(testId);
//        if (testOptional.isEmpty()) {
//            throw new RuntimeException("Test not found with id: " + testId);
//        }
//
//        userEntity  user = userRepository.getReferenceById(userId);
//        testEntity test = testOptional.get();
//        String[] lines = answer.split("\n");
//
//        String knownChaptersLine = lines[0].replace("Capitole stiute: ", "").trim();
//        String unknownChaptersLine = lines[1].replace("Capitole nestiute: ", "").trim();
//        String gradeLine = lines[3].replace("Nota pentru test: ", "").trim();
//
//        String[] gradeParts = gradeLine.split("/");
//        String grade = gradeParts[0];
//
//        List<UUID> knownChaptersList = new ArrayList<>();
//        if (knownChaptersLine != null && !knownChaptersLine.equals("-")) {
//            List<String> knownChapterNames = Arrays.asList(knownChaptersLine.split(", "));
//            List<chaptersEntity> knownChaptersList1 = chaptersRepository.findAllByNameIn(knownChapterNames);
//
//            knownChaptersList1.removeIf(chapterEntity -> !chapterEntity.getClassUser().getId().equals(user.getClassUser().getId()));
//            knownChaptersList = knownChaptersList1.stream().map(chaptersEntity::getId).toList();
//        }
//
//        List<UUID> unknownChaptersList = new ArrayList<>();
//        if (unknownChaptersLine != null && !unknownChaptersLine.equals("-")) {
//            List<String> unknownChapterNames = Arrays.asList(unknownChaptersLine.split(", "));
//            List<chaptersEntity> unknownChaptersList1 = chaptersRepository.findAllByNameIn(unknownChapterNames);
//
//            unknownChaptersList1.removeIf(chapterEntity -> !chapterEntity.getClassUser().getId().equals(user.getClassUser().getId()));
//            unknownChaptersList = unknownChaptersList1.stream().map(chaptersEntity::getId).toList();
//        }
//
//        Map<UUID, UUID> knownChaptersMap = new HashMap<>();
//        if (knownChaptersList != null && !knownChaptersList.isEmpty()) {
//            knownChaptersList.forEach(chapterId -> knownChaptersMap.put(chapterId, userId));
//        }
//
//        Map<UUID, UUID> unknownChaptersMap = new HashMap<>();
//        if (unknownChaptersList != null && !unknownChaptersList.isEmpty()) {
//            unknownChaptersList.forEach(chapterId -> unknownChaptersMap.put(chapterId, userId));
//        }
//
//        test.setKnownChapters(knownChaptersMap, userId);
//        test.setUnknownChapters(unknownChaptersMap, userId);
//        test.setTestAnsType(answer);
//        test.setGrades(Integer.parseInt(grade));
//        test.setUser(userRepository.getReferenceById(userId));
//        testEntity savedTest = testRepository.save(test);
//        return savedTest.getId();
//    }
//
//
//    private static ChatMessage createUserMessage(String promptText) {
//        return new ChatMessage(ChatMessageRole.USER.value(), promptText);
//    }
//
//    private static ChatCompletionRequest createCompletionRequest(ChatMessage userMessage) {
//        List<ChatMessage> messages = Collections.singletonList(userMessage);
//
//        return ChatCompletionRequest.builder()
//                .messages(messages)
//                .build();
//    }
//    private List<String> getChapterNames(List<chaptersEntity> chapters) {
//        return chapters.stream()
//                .map(chaptersEntity::getName)
//                .collect(Collectors.toList());
//    }
//}
