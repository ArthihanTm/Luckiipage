package dev.zwazel.springintro.games.blackjack;

import java.util.UUID;

public class BlackjackGame {
    private final String id;
    private final double bet;
    private final Deck deck;
    private final Hand playerHand;
    private final Hand dealerHand;
    private GameStatus status;
    private boolean finished;

    public BlackjackGame(double bet) {
        this.id = UUID.randomUUID().toString();
        this.bet = bet;
        this.deck = new Deck();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
        this.status = GameStatus.PLAYER_TURN;
        this.finished = false;

        // Deal 2 cards each
        playerHand.addCard(deck.pullCard());
        dealerHand.addCard(deck.pullCard());
        playerHand.addCard(deck.pullCard());
        dealerHand.addCard(deck.pullCard());
    }

    public String getId() {
        return id;
    }

    public double getBet() {
        return bet;
    }

    public Deck getDeck() {
        return deck;
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

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }
}
