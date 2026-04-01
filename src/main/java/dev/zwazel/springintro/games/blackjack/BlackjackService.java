package dev.zwazel.springintro.games.blackjack;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BlackjackService {
    private final Map<String, BlackjackGame> games = new ConcurrentHashMap<>();

    public GameResponse startGame(StartGameRequest request) {
        String id = UUID.randomUUID().toString();
        BlackjackGame game = new BlackjackGame(id, request.getBet());
        games.put(id, game);
        return game.toResponse(false);
    }

    public GameResponse hit(String gameId) {
        BlackjackGame game = requireGame(gameId);
        game.hit();
        return game.toResponse(game.isFinished());
    }

    public GameResponse stand(String gameId) {
        BlackjackGame game = requireGame(gameId);
        game.stand();
        return game.toResponse(true);
    }

    public GameResponse getGame(String gameId) {
        BlackjackGame game = requireGame(gameId);
        return game.toResponse(game.isFinished() || game.getStatus() != GameStatus.PLAYER_TURN);
    }

    private BlackjackGame requireGame(String gameId) {
        BlackjackGame game = games.get(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found: " + gameId);
        }
        return game;
    }
}
