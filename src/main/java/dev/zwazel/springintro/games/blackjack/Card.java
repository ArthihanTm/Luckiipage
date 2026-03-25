package dev.zwazel.springintro.games.blackjack;
import dev.zwazel.springintro.games.blackjack.Suit;
import dev.zwazel.springintro.games.blackjack.Rank;
public class Card {
    private final Suit suit;
    private final Rank rank;

    public Card(Suit suit, Rank rank) {
        this.suit = suit;
        this.rank = rank;
    }

    public Suit getSuit() {
        return suit;
    }

    public Rank getRank() {
        return rank;
    }

    @Override
    public String toString() {
        return rank + " of " + suit;
    }
}


class Print {
    // 1. To access 'card' in the static main method, it should be static
    // OR you should instantiate it inside the method.
    static Card card = new Card(Suit.CLUBS, Rank.ACE);

    // 2. The method signature must be 'void main', not 'main void'
    public static void main(String[] args) {
        System.out.println(card);
    }
}

