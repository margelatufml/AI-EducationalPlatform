package project.intelectabackend.services;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import project.intelectabackend.controllers.request.ChapterCountRequest;
import project.intelectabackend.controllers.request.exercisesRequest;
import project.intelectabackend.controllers.request.gptForExercises;
import project.intelectabackend.controllers.request.userProgressRequest;
import project.intelectabackend.controllers.response.CountResponse;
import project.intelectabackend.controllers.response.userProgressResponse;
import project.intelectabackend.mappers.exercisesMapper;
import project.intelectabackend.mappers.userProgressMapper;
import project.intelectabackend.repositories.chaptersRepository;
import project.intelectabackend.repositories.entity.chaptersEntity;
import project.intelectabackend.repositories.entity.exercisesEntity;
import project.intelectabackend.repositories.entity.userEntity;
import project.intelectabackend.repositories.entity.userProgressEntity;
import project.intelectabackend.repositories.exercisesRepository;
import project.intelectabackend.repositories.userProgressRepository;
import project.intelectabackend.repositories.userRepository;
import org.mariuszgromada.math.mxparser.*;

import java.time.*;
import java.util.Date;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class userProgressService {
    private final userProgressRepository userProgressRepository;
    private final userRepository userRepository;
    private final chaptersRepository chaptersRepository;
    private final exercisesRepository exercisesRepository;
    private final userProgressMapper userProgressMapper;
    private final exercisesMapper exercisesMapper;
    private final exercisesService exercisesService;


    @Value("${openai.model3}")
    private String model3;

    @Value("${openai.model4}")
    private String model4;

    @Value("${openai.model4o}")
    private String model4o;

    @Value("${openai.api.key}")
    private String apiKey;

    public ResponseEntity<String> correctExercices (userProgressRequest userProgressRequest){
        try {
            userEntity user = userRepository.findById(userProgressRequest.getUserId()).get();
            exercisesEntity exercises = exercisesRepository.findById(userProgressRequest.getExerciseId()).get();
            chaptersEntity chapter = chaptersRepository.getReferenceById(exercises.getChapter().getId());

            if (isAnswerCorrect(userProgressRequest.getAnswer().trim(), exercises.getAnswer().trim())) {
                return getStringResponseEntity(user, exercises, chapter);

            } else {
                OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(200));
                String promptText = "Tu esti un profesor de liceu cu o experienta foarte mare ca si cadru didactic. Tie iti place sa corectezi exercitii,  doar in cazul in care rezolvarea este gresita, doar atunci iti si place sa explici cum trebuia de fapt rezolvata acest exercitiu, altfel in cazul in care rezolvarea este corecta iti place sa spui 'DA'. Verifica si csorecteaza exercitiile, si Explica rezolvarea doar a exercitiilor unde ai primit un raspuns gresit din partea elevului. Exercitiul este " + exercises.getContent() + " si raspunsul oferit de elev este " + userProgressRequest.getAnswer() + ". Pentru a oferi o explicatie cat mai buna, structura folosita pentru a explica rezolvarea exercitiului, doar in cazul in care raspunsul dat de elev este gresit, este compus din structura IPM, 'I-Incurajare:' prin care incurajezi elevul sa mai incerce inca o data; 'P-Pasi:' prin care exprimi pasii prin care trebuia de fapt rezolvat exercitiul corect unde exercitiile matematica sa fie exprimate prin latex; si 'M-Mesaj:' prin care afisezi mesajul 'Mai incearca inca o data', mentionand desigur, pasul din stuctura la care esti prin numele structurii si doua puncte, spre exemlu 'I-Incurajare:' 'P-Pasi:' 'M-Mesaj:', si vreau sa te asiguri ca raspunsul este dat doar prin aceasta structura, nimic mai mult, adica raspunsul nu trebuie sa contina text ce nu se potriveste acestei structuri IPM, si la finalul raspunsului sa fie '*&*'. Raspunsurile date de tine trebuie sa aiba un ton calm, clar, simplist si pentru pasii de rezolvare acestia sa contina latex, asiguradu-te ca este respectat modelul IPM si ca inceputul fiecarei componente dein IPM este respectat, adica 'I-Incurajare:' , 'P-Pasi:' si 'M-Masi:'";
                ChatMessage userMessage = createUserMessage(promptText);
                ChatCompletionRequest completionRequest = createCompletionRequest(userMessage);
                if (userProgressRequest.isPremium()) {
                    completionRequest.setModel(model4o);
                } else {
                    completionRequest.setModel(model4o);
                }

                String answerGpt =service.createChatCompletion(completionRequest).getChoices().get(0).getMessage().getContent();
   System.out.println("??????????????????????????????????????????????????????????????????????????????? " + userProgressRequest.getAnswer() +" /////" + exercises.getContent()+ "                                         " +answerGpt);
                if(answerGpt.contains("DA") && !answerGpt.contains("Mai incearca inca o data"))
                {
                    exercises.setAnswer(userProgressRequest.getAnswer());
                    exercisesRepository.save(exercises);
                    return getStringResponseEntity(user, exercises, chapter);
                }
                else
                {
                    user.setLives(user.getLives() - 1);
                    user.getChapterStrikeCounts().put(chapter.getId(), 0);
                    Map<UUID, LocalDateTime> lastErrorTimes = user.getLastErrorTimes();
                    lastErrorTimes.put(chapter.getId(), LocalDateTime.now());
                    userRepository.save(user);
                }
                return ResponseEntity.status(HttpStatus.CREATED).body(answerGpt);

            }
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    @NotNull
    private ResponseEntity<String> getStringResponseEntity(userEntity user, exercisesEntity exercises, chaptersEntity chapter) {
        userProgressEntity userProgress = new userProgressEntity();
        userProgress.setUser(user);
        userProgress.setExercises(exercises);
        userProgress.setChapter(chapter);
        LocalDateTime now = LocalDateTime.now();
        ZonedDateTime zonedDateTime = now.atZone(ZoneId.systemDefault());
        Instant instant = zonedDateTime.toInstant();
        Date date = Date.from(instant);
        userProgress.setDate(date);

        user.setPoints(user.getPoints() + exercises.getPoints());
        if(exercises.getType().equals("hard")) {
            Integer currentStrikeCount = user.getChapterStrikeCounts().getOrDefault(chapter.getId(), 0);
            if (currentStrikeCount == null) {
                currentStrikeCount = 0;
            }
            user.getChapterStrikeCounts().put(chapter.getId(), currentStrikeCount + 1);
        }
        user = userRepository.save(user);
        userProgress = userProgressRepository.save(userProgress);

        if(user.getChapterStrikeCounts().get(chapter.getId())>=10)
        {
            user.setPoints(user.getPoints()+20);
            user.getChapterStrikeCounts().put(chapter.getId(), 0);
            userRepository.save(user);

            chaptersEntity chapter1 = chaptersRepository.findById(chapter.getId()).orElseThrow(() -> new EntityNotFoundException("Chapter not found"));
            List<userEntity> exercises1 = chapter1.getUsersFinish();
            exercises1.add(user);
            chapter1.setUsersFinish(exercises1);
            chaptersRepository.save(chapter1);
        }
        return ResponseEntity.ok(userProgressMapper.fromEntity1(userProgress));
    }

//    public boolean isAnswerCorrect(String userAnswer, String expectedAnswer) {
//
//        Pattern pattern = Pattern.compile("\\d+");
//        Matcher userMatcher = pattern.matcher(userAnswer);
//        Matcher expectedMatcher = pattern.matcher(expectedAnswer);
//
//        boolean isCorrect = false;
//        if (userMatcher.find() && expectedMatcher.find()) {
//            String userNumber = userMatcher.group();
//            String expectedNumber = expectedMatcher.group();
//            isCorrect = userNumber.equals(expectedNumber);
//        }
//        return isCorrect;
//    }


    public boolean isAnswerCorrect(String userAnswer, String expectedAnswer) {
        String normalizedUserAnswer = userAnswer.replaceAll("\\s+", "");
        String normalizedExpectedAnswer = expectedAnswer.replaceAll("\\s+", "");

        String finalUserAnswer = normalizedUserAnswer.substring(normalizedUserAnswer.lastIndexOf('=') + 1).trim();
        String finalExpectedAnswer = normalizedExpectedAnswer.substring(normalizedExpectedAnswer.lastIndexOf('=') + 1).trim();

        if (finalUserAnswer.equals(finalExpectedAnswer)) {
            return true;
        }

        Expression userExpression = new Expression(finalUserAnswer);
        Expression expectedExpression = new Expression(finalExpectedAnswer);

        double userResult = userExpression.calculate();
        double expectedResult = expectedExpression.calculate();

        double tolerance = 0.000001;
        return Math.abs(userResult - expectedResult) < tolerance;
    }



    public ResponseEntity<String> mesajMaiUser(userProgressRequest userProgressRequest){
        exercisesEntity exercises = exercisesRepository.findById(userProgressRequest.getExerciseId()).get();

        OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(200));
        String promptText = "Asta este exercitiul:"+exercises.getContent()+".Asta a fost raspunsul pe care l-am primit cand am gresit: "+userProgressRequest.getMesajPrecedent()+".Asta a fost raspunsul meu pentru intrebare:"+userProgressRequest.getRaspunsAnterior()+". Te rog sa imi explici pe intelesul meu, ca sa inteleg.";
        ChatMessage userMessage = createUserMessage(promptText);
        ChatCompletionRequest completionRequest = createCompletionRequest(userMessage);
        if (userProgressRequest.isPremium()) {
            completionRequest.setModel(model4);
        } else {
            completionRequest.setModel(model3);
        }
        return ResponseEntity.status(HttpStatus.OK).body(service.createChatCompletion(completionRequest).getChoices().get(0).getMessage().getContent());
    }

    public List<Object[]> top3Scores() {
        return userProgressRepository.findTop3UsersByChapter();

    }

    public List<userProgressResponse> getTrackForUser(UUID userId) {
        List<userProgressEntity> userProgressList = userProgressRepository.findByUserId(userId);
        List<userProgressResponse> userProgressResponseList = new ArrayList<>();

        for (userProgressEntity userProgressEntity : userProgressList) {
            userProgressResponseList.add(userProgressMapper.fromEntity(userProgressEntity));
        }

        return userProgressResponseList;
    }

    public CountResponse getUserCompletedExercisesCountByChapter(UUID userId, UUID chapterId) {
        List<userProgressEntity> userProgressList = userProgressRepository.findByUserIdAndChapterId(userId, chapterId);
        long completedExercises = userProgressList.stream()
                .map(userProgressEntity::getExercises)
                .distinct()
                .count();

        long totalExercises = exercisesRepository.findByChapterId(chapterId).size();

        CountResponse response = new CountResponse();
        response.setCompletedExercices(completedExercises);
        response.setTotalExercices(totalExercises);

        return response;
    }

    public String createExercisesFromGPT(gptForExercises gpt) {
        chaptersEntity chapters = chaptersRepository.findById(gpt.getChapterId())
                .orElseThrow(() -> new RuntimeException("Not found!"));
        List<exercisesEntity> entities = exercisesRepository.getExercisesForChapterAndType(gpt.getChapterId(), gpt.getType());
        AtomicInteger counter = new AtomicInteger(1);
        String exercisesString = entities.stream()
                .map(exercise -> counter.getAndIncrement() + ". " + exercise.getContent() + " " + exercise.getAnswer())
                .collect(Collectors.joining(", "));
        OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(200));
        String promptText =
                "Pentru următorul capitol: " + chapters.getName() + ", " +
                        "clasa a " + chapters.getClassUser().getClassNumber() + ". " +
                        "Vreau să îmi generezi " + gpt.getNumber() +
                        " exerciții de tip " + gpt.getType() + ". " +
                        "Important: Exercițiile trebuie să fie diferite față de cele din lista: " + exercisesString + ". " +
                        "\n\nFormatul pentru fiecare exercițiu și răspunsul aferent trebuie să fie astfel: " +
                        "'<număr_exercițiu>. <conținut_exercițiu> RĂSPUNS: <răspuns>' " +
                        "Exemplu clar: ' 2+x=0 RĂSPUNS: x=-2'. " +
                        "Fiecare exercițiu, împreună cu răspunsul său, trebuie să fie pe un rând separat, " +
                        "începând cu numărul exercițiului și un punct. Exercitiile si rezolvarile trebuie sa fie bune din punct de vedere matematic.";
        ChatMessage userMessage = createUserMessage(promptText);
        ChatCompletionRequest completionRequest = createCompletionRequest(userMessage);
        if (gpt.isPremium()) {
            completionRequest.setModel(model4);
        } else {
            completionRequest.setModel(model3);
        }
        String answer = service.createChatCompletion(completionRequest).getChoices().get(0).getMessage().getContent();

        String[] exerciseLines = answer.split("\\n");

        for (String line : exerciseLines) {
            Pattern pattern = Pattern.compile("^(\\d+\\. )(.*? RĂSPUNS: .*?)$");
            Matcher matcher = pattern.matcher(line);
            if (matcher.find()) {
                String contentWithNumber = matcher.group(2).trim();
                String[] parts = contentWithNumber.split(" RĂSPUNS: ");
                String content = parts[0].trim();
                String answer1 = parts.length > 1 ? parts[1].trim() : "";

                exercisesRequest request = new exercisesRequest();
                request.setContent(content);
                request.setAnswer(answer1);
                request.setType(gpt.getType());
                request.setChapterId(gpt.getChapterId());

                try {
                    exercisesService.createExercises(request);
                } catch (Exception e) {
                    throw new RuntimeException("Eroare la salvarea exercițiului în baza de date: " + e.getMessage());
                }
            }
        }

        return answer;
    }


    private static String getAnswer(String answer) {
        if (answer != null && answer.contains("Răspuns: ")) {
            int startIndex = answer.indexOf("Răspuns: ") + "Răspuns: ".length();
            return answer.substring(startIndex);
        } else {
            return null;
        }
    }

    private static ChatMessage createUserMessage(String promptText) {
        return new ChatMessage(ChatMessageRole.USER.value(), promptText);
    }

    private static ChatCompletionRequest createCompletionRequest(ChatMessage userMessage) {
        List<ChatMessage> messages = Collections.singletonList(userMessage);

        return ChatCompletionRequest.builder()
                .messages(messages)
                .build();
    }
}
