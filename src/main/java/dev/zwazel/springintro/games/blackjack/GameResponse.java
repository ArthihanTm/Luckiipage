package dev.zwazel.springintro.games.blackjack;

import java.util.List;
import java.util.stream.Collectors;

public class GameResponse {
    private String gameId;
    private List<String> playerCards;
    private List<String> dealerCards;
    private int playerValue;
    private int dealerValue;
    private GameStatus status;
    private String message;
    private boolean finished;

    public GameResponse() {
    }

    public static GameResponse from(BlackjackGame game, int playerValue, int dealerValue) {
        GameResponse response = new GameResponse();
        response.gameId = game.getId();
        response.playerCards = game.getPlayerHand().getCards().stream()
                .map(Card::toString)
                .collect(Collectors.toList());
        response.playerValue = playerValue;
        response.status = game.getStatus();
        response.finished = game.isFinished();

        // Hide dealer's second card while it's the player's turn
        if (game.getStatus() == GameStatus.PLAYER_TURN) {
            List<Card> dealerCards = game.getDealerHand().getCards();
            if (dealerCards.size() >= 2) {
                response.dealerCards = List.of(dealerCards.get(0).toString(), "[hidden]");
            } else {
                response.dealerCards = dealerCards.stream()
                        .map(Card::toString)
                        .collect(Collectors.toList());
            }
            // Only show the value of the first visible card
            response.dealerValue = dealerCards.isEmpty() ? 0 : dealerCards.get(0).getRank().getPointValue();
        } else {
            response.dealerCards = game.getDealerHand().getCards().stream()
                    .map(Card::toString)
                    .collect(Collectors.toList());
            response.dealerValue = dealerValue;
        }

        response.message = buildMessage(game.getStatus());
        return response;
    }

    private static String buildMessage(GameStatus status) {
        return switch (status) {
            case NOT_STARTED -> "Game not started.";
            case PLAYER_TURN -> "Your turn — hit or stand?";
            case DEALER_TURN -> "Dealer is playing...";
            case PLAYER_BUST -> "You busted! Dealer wins.";
            case DEALER_BUST -> "Dealer busted! You win!";
            case PLAYER_BLACKJACK -> "Blackjack! You win!";
            case PLAYER_WIN -> "You win!";
            case DEALER_WIN -> "Dealer wins.";
            case PUSH -> "Push — it's a tie.";
            case GAME_OVER -> "Game over.";
        };
    }

    // Getters for JSON serialization
    public String getGameId() { return gameId; }
    public List<String> getPlayerCards() { return playerCards; }
    public List<String> getDealerCards() { return dealerCards; }
    public int getPlayerValue() { return playerValue; }
    public int getDealerValue() { return dealerValue; }
    public GameStatus getStatus() { return status; }
    public String getMessage() { return message; }
    public boolean isFinished() { return finished; }
}
