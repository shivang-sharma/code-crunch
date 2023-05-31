FROM amazoncorretto:latest
WORKDIR /java_sandbox/testEngine
COPY testEngine/ .
COPY TestEngine.java .
COPY execute.sh .
RUN chmod +x execute.sh
RUN javac TestEngine.java
CMD [ "java", "TestEngine" ]