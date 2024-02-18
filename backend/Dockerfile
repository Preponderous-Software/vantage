FROM ubuntu:20.04 as builder

# Set the working directory
WORKDIR /opt/vantage-build

# Install dependencies
RUN apt-get update
RUN apt-get install -y openjdk-17-jdk
RUN apt-get install -y wget
RUN apt-get install -y git

# Copy everything but Dockerfile
WORKDIR /opt/vantage-backend-build
COPY ./.gradle ./.gradle
COPY ./bin ./bin
COPY ./gradle ./gradle
COPY ./src ./src
COPY .gitignore .gitignore
COPY build.gradle build.gradle
COPY gradle.properties gradle.properties
COPY gradlew gradlew
COPY gradlew.bat gradlew.bat
COPY settings.gradle settings.gradle

# Build the backend
RUN sed -i 's/\r$//' gradlew
RUN chmod +x gradlew
RUN ./gradlew build

# Build the spigot server
WORKDIR /opt/spigot-build
RUN wget -O BuildTools.jar https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
RUN git config --global --unset core.autocrlf || :
RUN java -jar BuildTools.jar --rev 1.20.4


FROM ubuntu:20.04 as runtime

# Set the working directory
WORKDIR /opt/vantage-backend

# Install Java 17 runtime
RUN apt-get update
RUN apt-get install -y openjdk-17-jre

# Copy the built jars to the backend directory
COPY --from=builder /opt/vantage-backend-build/build/libs/vantage-2.1.0-SNAPSHOT-all.jar /opt/vantage-backend/vantage-2.1.0-SNAPSHOT-all.jar
RUN mkdir /opt/vantage-backend/minecraft-server
COPY --from=builder /opt/spigot-build/spigot-1.20.4.jar /opt/vantage-backend/minecraft-server/spigot-1.20.4.jar
RUN echo "eula=true" > /opt/vantage-backend/minecraft-server/eula.txt

# Set the entrypoint
ENTRYPOINT ["java", "-jar", "vantage-2.1.0-SNAPSHOT-all.jar"]