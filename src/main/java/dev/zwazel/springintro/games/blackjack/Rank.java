/*
 * Needed before this file:
 * - none
 *
 * TODO (superficial):
 * - add rank values and base points
 * - set JACK/QUEEN/KING to 10
 * - set ACE base value to 11 (1/11 logic in service)
 */
package dev.zwazel.springintro.games.blackjack;
public enum Rank {
    ACE("Ace", 11),
    TWO("Two", 2),
    THREE("Three", 3),
    FOUR("Four",4),
    FIVE("Five",5),
    SIX("Six",6),
    SEVEN("Seven",7),
    EIGHT("Eight",8),
    NINE("Nine",9),
    TEN("Ten",10),
    JACK("Jack",10),
    QUEEN("Queen",10),
    KING("King",10);

    String rankName;
    int rankValue;

    Rank(String rankName, int rankValue){
        this.rankName = rankName;
        this.rankValue = rankValue;
    }

    public String toString(){
        return rankName;
    }
}