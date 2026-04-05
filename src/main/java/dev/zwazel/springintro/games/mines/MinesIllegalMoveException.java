package dev.zwazel.springintro.games.mines;

/**
 * Thrown when a Mines action is not allowed (wrong phase, bad index, duplicate reveal, etc.).
 * Map to HTTP 400 or 409 in a {@code @ControllerAdvice} as you prefer.
 */
public class MinesIllegalMoveException extends RuntimeException {

    public MinesIllegalMoveException(String message) {
        super(message);
    }
}
