package dev.zwazel.springintro.games.mines;

/**
 * Thrown when no Mines round exists for the given id. Map to HTTP 404 in {@link MinesExceptionHandler}.
 */
public class MinesNotFoundException extends RuntimeException {

    public MinesNotFoundException(String message) {
        super(message);
    }
}
