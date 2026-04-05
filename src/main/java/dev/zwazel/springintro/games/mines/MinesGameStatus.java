package dev.zwazel.springintro.games.mines;

/**
 * Lifecycle state of a single Mines round (stake, hidden mines, safe reveals, optional cash-out).
 *
 * <p>Serialized by Jackson as the enum name string (e.g. {@code "PLAYING"}) unless you add
 * custom {@code @JsonProperty} on constants. Keep names in sync with the frontend.</p>
 */
public enum MinesGameStatus {

    /** Round is active: player may reveal a cell or cash out (if rules allow). */
    PLAYING,

    /** Player revealed a mine: stake is lost; round is over. */
    LOST,

    /** Player cashed out: winnings applied per multiplier; round is over. */
    WON_CASHOUT,
}
