package dev.zwazel.springintro.games.blackjack;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Deck {
    private List<Card> cards;
    public Deck() {
        this.cards = new ArrayList<>();
        // Create 52 cards by looping over all Suits and Ranks
        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                this.cards.add(new Card(suit, rank));
            }
        }
        shuffle(); // Shuffle the deck immediately upon creation
    }

    // Shuffles the cards
    public void shuffle() {
        Collections.shuffle(cards);
    }

    // Pulls the top card from the deck
    public Card pullCard() {
        if (cards.isEmpty()) {
            throw new IllegalStateException("Cannot pull from an empty deck");
        }
        // Remove and return the last card in the list (acts as the top of the deck)
        return cards.remove(cards.size() - 1);
    }

    public int getRemainingCardsCount() {
        return cards.size();
    }
}
