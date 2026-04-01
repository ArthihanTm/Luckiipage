package dev.zwazel.springintro.games.blackjack;

import java.util.ArrayList;
import java.util.List;

public class Hand {
    private List<Card> cards;

    public Hand() {
        this.cards = new ArrayList<>();
    }

    public void addCard(Card card) {
        this.cards.add(card);
    }

    public List<Card> getCards() {
        return cards;
    }

    public int getBestTotal() {
        int total = 0;
        int aceCount = 0;

        for (Card c : cards) {
            if (c.getRank() == Rank.ACE) {
                aceCount++;
            }
            total += c.getRank().getPointValue();
        }

        while (total > 21 && aceCount > 0) {
            total -= 10; // Ace(11) -> Ace(1)
            aceCount--;
        }

        return total;
    }

    public boolean isBust() {
        return getBestTotal() > 21;
    }

    public boolean isBlackjack() {
        return cards.size() == 2 && getBestTotal() == 21;
    }
}
