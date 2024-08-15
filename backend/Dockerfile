FROM eclipse-temurin:22-jdk-jammy as builder

WORKDIR /app

COPY .mvn/ .mvn

COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY ./src ./src

RUN ./mvnw clean install -DskipTests=true

FROM eclipse-temurin:22-jre-jammy

ARG JAR_FILE=target/*.jar

WORKDIR /app

COPY --from=builder /app/${JAR_FILE} app.jar

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

EXPOSE 8080

ENTRYPOINT ["/wait-for-it.sh", "db:3306", "--", "java", "-jar", "app.jar"]