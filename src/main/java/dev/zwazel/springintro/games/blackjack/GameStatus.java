package dev.zwazel.springintro.games.blackjack;
/*
 * Needed before this file:
 * - none
 *
 * TODO (superficial):
 * - add status enum values
 * - include turn states and end states
 * - keep names short and consistent
 */
public enum GameStatus {
    NOT_STARTED,
    PLAYER_TURN,
    DEALER_TURN,
    PLAYER_BUST,
    DEALER_BUST,
    PLAYER_BLACKJACK,
    PLAYER_WIN,
    DEALER_WIN,
    PUSH,
    GAME_OVER
}