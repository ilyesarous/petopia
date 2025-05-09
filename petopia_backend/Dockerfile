# Build stage: using Maven and OpenJDK 17
FROM maven:3.8.6-openjdk-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and source files
COPY pom.xml .
COPY src ./src

# Build the project (package it as a JAR file)
RUN mvn clean package -DskipTests

# Final stage: runtime environment with OpenJDK 17 (slim image)
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the packaged .jar file from the build stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port that the Spring Boot app will run on
EXPOSE 8080

# Define the entry point for the container (run the Spring Boot app)
ENTRYPOINT ["java", "-jar", "app.jar"]
