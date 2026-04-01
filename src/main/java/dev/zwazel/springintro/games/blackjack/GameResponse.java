package dev.zwazel.springintro.games.blackjack;

import java.util.List;

public record GameResponse(
        String id,
        double bet,
        GameStatus status,
        boolean finished,
        String message,
        List<Card> playerCards,
        int playerTotal,
        List<Card> dealerCards,
        Integer dealerTotal
) {}
