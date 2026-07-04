# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production JRE runtime stage
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
COPY --from=build /app/target/smart-erp-application-0.0.1-SNAPSHOT.jar app.jar
# Install curl for healthcheck validation on alpine base
RUN apk add --no-cache curl

# Healthcheck definition targeting HealthController
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:9521/health || exit 1

EXPOSE 9521
ENTRYPOINT ["java", "-jar", "app.jar"]
