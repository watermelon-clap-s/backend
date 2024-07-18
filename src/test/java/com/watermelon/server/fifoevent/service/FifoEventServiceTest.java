package com.watermelon.server.fifoevent.service;

import com.watermelon.server.ServerApplication;
import com.watermelon.server.fifoevent.dto.request.RequestFiFoEventDto;
import com.watermelon.server.fifoevent.repository.FifoEventRepository;
import com.watermelon.server.fifoevent.repository.QuizRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;


//@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource("classpath:application-local-db.yml")
@SpringBootTest(classes = ServerApplication.class)
class FifoEventServiceTest {

    @Autowired
    private FifoEventService fifoEventService;
    @Autowired
    private FifoEventRepository fifoEventRepository;
    @Autowired
    private QuizRepository quizRepository;

    @BeforeEach
    public void makeFifoEvent(){

        RequestFiFoEventDto requestFiFoEventDto = RequestFiFoEventDto.builder()
                .startTime(LocalDateTime.now())
                .question("test-question")
                .answer("test-answer")
                .maxWinnerCount(100)
                .build();
        fifoEventService.makeEvent(requestFiFoEventDto);
    }

    @Test
    public void makeQuizTest(){

        //then
        Assertions.assertThat(fifoEventRepository.findAll().size()).isEqualTo(1);
        Assertions.assertThat(quizRepository.findAll().size()).isEqualTo(1);

    }

}