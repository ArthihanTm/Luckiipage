package dev.zwazel.springintro.games.blackjack;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BlackjackService {

    private final Map<String, BlackjackGame> games = new ConcurrentHashMap<>();

    public GameResponse startGame(StartGameRequest request) {
        BlackjackGame game = new BlackjackGame(request.getBet());

        int playerValue = calculateHandValue(game.getPlayerHand());

        // Check for immediate blackjack (ace + 10-value card)
        if (playerValue == 21) {
            game.setStatus(GameStatus.PLAYER_BLACKJACK);
            game.setFinished(true);
        }

        games.put(game.getId(), game);
        return GameResponse.from(game, playerValue, calculateHandValue(game.getDealerHand()));
    }

    public GameResponse hit(String gameId) {
        BlackjackGame game = findGame(gameId);

        if (game.isFinished()) {
            throw new IllegalStateException("Game is already finished.");
        }
        if (game.getStatus() != GameStatus.PLAYER_TURN) {
            throw new IllegalStateException("It is not the player's turn.");
        }

        game.getPlayerHand().addCard(game.getDeck().pullCard());
        int playerValue = calculateHandValue(game.getPlayerHand());

        if (playerValue > 21) {
            game.setStatus(GameStatus.PLAYER_BUST);
            game.setFinished(true);
        } else if (playerValue == 21) {
            // Auto-stand on 21
            return stand(gameId);
        }

        return GameResponse.from(game, playerValue, calculateHandValue(game.getDealerHand()));
    }

    public GameResponse stand(String gameId) {
        BlackjackGame game = findGame(gameId);

        if (game.isFinished()) {
            throw new IllegalStateException("Game is already finished.");
        }

        game.setStatus(GameStatus.DEALER_TURN);

        // Dealer draws until at least 17
        int dealerValue = calculateHandValue(game.getDealerHand());
        while (dealerValue < 17) {
            game.getDealerHand().addCard(game.getDeck().pullCard());
            dealerValue = calculateHandValue(game.getDealerHand());
        }

        int playerValue = calculateHandValue(game.getPlayerHand());

        // Determine winner
        if (dealerValue > 21) {
            game.setStatus(GameStatus.DEALER_BUST);
        } else if (dealerValue > playerValue) {
            game.setStatus(GameStatus.DEALER_WIN);
        } else if (playerValue > dealerValue) {
            game.setStatus(GameStatus.PLAYER_WIN);
        } else {
            game.setStatus(GameStatus.PUSH);
        }

        game.setFinished(true);
        return GameResponse.from(game, playerValue, dealerValue);
    }

    public GameResponse getGame(String gameId) {
        BlackjackGame game = findGame(gameId);
        return GameResponse.from(game, calculateHandValue(game.getPlayerHand()),
                calculateHandValue(game.getDealerHand()));
    }

    private BlackjackGame findGame(String gameId) {
        BlackjackGame game = games.get(gameId);
        if (game == null) {
            throw new GameNotFoundException("Game not found: " + gameId);
        }
        return game;
    }

    public int calculateHandValue(Hand hand) {
        int value = 0;
        int aces = 0;

        for (Card card : hand.getCards()) {
            value += card.getRank().getPointValue();
            if (card.getRank() == Rank.ACE) {
                aces++;
            }
        }

        // Convert aces from 11 to 1 to avoid bust
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }
}
