package dev.zwazel.springintro.games.mines;

import dev.zwazel.springintro.security.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;

@RestControllerAdvice(basePackageClasses = MinesController.class)
public class MinesExceptionHandler {

    @ExceptionHandler(MinesNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(MinesNotFoundException ex, WebRequest request) {
        ErrorResponse body = ErrorResponse.builder()
                .timestamp(Instant.now())
                .error("Not Found")
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .path(request.getDescription(false))
                .build();
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MinesIllegalMoveException.class)
    public ResponseEntity<ErrorResponse> handleIllegalMove(MinesIllegalMoveException ex, WebRequest request) {
        ErrorResponse body = ErrorResponse.builder()
                .timestamp(Instant.now())
                .error("Bad Request")
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .path(request.getDescription(false))
                .build();
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}
