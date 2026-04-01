package dev.zwazel.springintro.games.blackjack;

import java.util.List;

public class BlackjackGame {
    private final String id;
    private final double bet;
    private final Deck deck;
    private final Hand playerHand;
    private final Hand dealerHand;

    private GameStatus status;
    private boolean finished;
    private String message;

    public BlackjackGame(String id, double bet) {
        if (bet <= 0) {
            throw new IllegalArgumentException("Bet must be greater than 0");
        }
        this.id = id;
        this.bet = bet;
        this.deck = new Deck();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
        this.status = GameStatus.PLAYER_TURN;
        this.finished = false;
        this.message = "";

        dealInitialCards();
        evaluateAfterInitialDeal();
    }

    private void dealInitialCards() {
        // typical dealing: player, dealer, player, dealer
        playerHand.addCard(deck.pullCard());
        dealerHand.addCard(deck.pullCard());
        playerHand.addCard(deck.pullCard());
        dealerHand.addCard(deck.pullCard());
    }

    private void evaluateAfterInitialDeal() {
        boolean playerBJ = playerHand.isBlackjack();
        boolean dealerBJ = dealerHand.isBlackjack();

        if (playerBJ && dealerBJ) {
            finish(GameStatus.PUSH, "Push. Both have blackjack.");
        } else if (playerBJ) {
            finish(GameStatus.PLAYER_BLACKJACK, "Blackjack! You win.");
        } else if (dealerBJ) {
            finish(GameStatus.DEALER_WIN, "Dealer has blackjack.");
        }
    }

    public void hit() {
        requirePlayerTurn();
        playerHand.addCard(deck.pullCard());

        if (playerHand.isBust()) {
            finish(GameStatus.PLAYER_BUST, "Bust. You lose.");
            return;
        }

        if (playerHand.getBestTotal() == 21) {
            // Auto-stand on 21 for simple rules.
            stand();
        }
    }

    public void stand() {
        requirePlayerTurn();
        status = GameStatus.DEALER_TURN;

        playDealerTurn();
        evaluateWinner();
    }

    private void playDealerTurn() {
        // Dealer stands on all 17s (including soft 17) for now.
        while (dealerHand.getBestTotal() < 17) {
            dealerHand.addCard(deck.pullCard());
        }
    }

    private void evaluateWinner() {
        if (dealerHand.isBust()) {
            finish(GameStatus.DEALER_BUST, "Dealer busts. You win.");
            return;
        }

        int playerTotal = playerHand.getBestTotal();
        int dealerTotal = dealerHand.getBestTotal();

        if (playerTotal > dealerTotal) {
            finish(GameStatus.PLAYER_WIN, "You win.");
        } else if (dealerTotal > playerTotal) {
            finish(GameStatus.DEALER_WIN, "Dealer wins.");
        } else {
            finish(GameStatus.PUSH, "Push.");
        }
    }

    private void finish(GameStatus finalStatus, String message) {
        this.status = finalStatus;
        this.finished = true;
        this.message = message;
    }

    private void requirePlayerTurn() {
        if (finished) {
            throw new IllegalStateException("Game is already finished.");
        }
        if (status != GameStatus.PLAYER_TURN) {
            throw new IllegalStateException("Not player's turn.");
        }
    }

    public GameResponse toResponse(boolean revealDealerHand) {
        Integer dealerTotal = revealDealerHand ? dealerHand.getBestTotal() : null;
        return new GameResponse(
                id,
                bet,
                status,
                finished,
                message,
                List.copyOf(playerHand.getCards()),
                playerHand.getBestTotal(),
                List.copyOf(dealerHand.getCards()),
                dealerTotal
        );
    }

    public String getId() {
        return id;
    }

    public double getBet() {
        return bet;
    }

    public Hand getPlayerHand() {
        return playerHand;
    }

    public Hand getDealerHand() {
        return dealerHand;
    }

    public GameStatus getStatus() {
        return status;
    }

    public boolean isFinished() {
        return finished;
    }

    public String getMessage() {
        return message;
    }
}
