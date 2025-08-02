FROM openjdk:21-jdk-slim
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradlew ./gradlew
COPY gradle ./gradle
COPY src ./src
RUN chmod +x ./gradlew && ./gradlew build --no-daemon -x test
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "build/libs/IntelectaBackEnd-0.0.1-SNAPSHOT.jar"]