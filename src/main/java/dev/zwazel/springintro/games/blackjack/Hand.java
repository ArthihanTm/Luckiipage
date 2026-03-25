package dev.zwazel.springintro.games.blackjack;

import java.util.ArrayList;
import java.util.List;
import dev.zwazel.springintro.games.blackjack.Suit;
import dev.zwazel.springintro.games.blackjack.Rank;
import dev.zwazel.springintro.games.blackjack.Card;
/*
 * Needed before this file:
 * - Card.java
 *
 * TODO (superficial):
 * - add list of cards
 * - add addCard(Card) helper
 * - return cards via getter
 */

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
}
class main {
    public static void main(String[] args) {
        Hand playerHand = new Hand();
        playerHand.addCard(new Card(Suit.HEARTS, Rank.ACE));
        playerHand.addCard(new Card(Suit.DIAMONDS, Rank.QUEEN));
        System.out.println(playerHand.getCards());
    }

}


