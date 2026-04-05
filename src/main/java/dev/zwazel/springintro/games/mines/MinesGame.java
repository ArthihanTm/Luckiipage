package dev.zwazel.springintro.games.mines;

import java.security.SecureRandom;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

/**
 * Core rules for one Mines round: stake, hidden mines, safe reveals, multiplier, cash-out.
 * No Spring or HTTP — keep API mapping and balance in {@code MinesService}.
 *
 * <p>Multiplier after {@code k} successful safe reveals (fair odds, no extra house edge) is
 * ∏<sub>j=0</sub><sup>k-1</sup> (T − j) / (S − j) with T = total cells and S = T − mineCount.</p>
 */
public class MinesGame {

    private static final int MIN_SIDE = 2;
    private static final int MAX_SIDE = 24;
    private static final int MAX_TOTAL_CELLS = 400;

    private final String id;
    private final double bet;
    private final int rows;
    private final int cols;
    private final int mineCount;
    private final int totalCells;
    private final int safeCellCount;
    private final Set<Integer> mineIndices;
    private final Set<Integer> revealedSafe = new HashSet<>();

    private MinesGameStatus status = MinesGameStatus.PLAYING;

    /**
     * @param id         stable round id (e.g. UUID string)
     * @param bet        stake; must be {@code > 0}
     * @param rows       grid height
     * @param cols       grid width
     * @param mineCount  mines to place; must satisfy {@code 1 <= mineCount < rows * cols}
     * @param random     used to sample distinct mine indices
     */
    public MinesGame(String id, double bet, int rows, int cols, int mineCount, SecureRandom random) {
        this.id = Objects.requireNonNull(id, "id");
        Objects.requireNonNull(random, "random");
        validateDimensions(bet, rows, cols, mineCount);
        this.bet = bet;
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.totalCells = rows * cols;
        this.safeCellCount = this.totalCells - mineCount;
        this.mineIndices = Collections.unmodifiableSet(placeMines(this.totalCells, mineCount, random));
    }

    public static MinesGame createNew(double bet, int rows, int cols, int mineCount) {
        return new MinesGame(UUID.randomUUID().toString(), bet, rows, cols, mineCount, new SecureRandom());
    }

    private static void validateDimensions(double bet, int rows, int cols, int mineCount) {
        if (bet <= 0) {
            throw new IllegalArgumentException("bet must be > 0");
        }
        if (rows < MIN_SIDE || rows > MAX_SIDE || cols < MIN_SIDE || cols > MAX_SIDE) {
            throw new IllegalArgumentException(
                    "rows and cols must be in [%d, %d]".formatted(MIN_SIDE, MAX_SIDE));
        }
        int total = rows * cols;
        if (total > MAX_TOTAL_CELLS) {
            throw new IllegalArgumentException("grid too large (max %d cells)".formatted(MAX_TOTAL_CELLS));
        }
        if (mineCount < 1 || mineCount >= total) {
            throw new IllegalArgumentException("mineCount must be >= 1 and < total cells");
        }
    }

    private static Set<Integer> placeMines(int totalCells, int mineCount, SecureRandom random) {
        Set<Integer> mines = new HashSet<>();
        while (mines.size() < mineCount) {
            mines.add(random.nextInt(totalCells));
        }
        return mines;
    }

    public String getId() {
        return id;
    }

    public double getBet() {
        return bet;
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public int getMineCount() {
        return mineCount;
    }

    public int getTotalCells() {
        return totalCells;
    }

    public MinesGameStatus getStatus() {
        return status;
    }

    public Set<Integer> getMineIndices() {
        return mineIndices;
    }

    public Set<Integer> getRevealedSafeIndices() {
        return Collections.unmodifiableSet(revealedSafe);
    }

    /**
     * Share of the “premium” above 1× that is paid out (rest is house edge). Fair math would use {@code 1.0}.
     * Lower = stingier multipliers; must be in {@code (0, 1]}.
     */
    private static final double MULTIPLIER_PREMIUM_PAID = 0.58;

    /**
     * Multiplier shown and used for payout. Based on fair odds, then dampened so the house keeps edge on
     * risk-adjusted returns ({@code 1 + (fair - 1) * MULTIPLIER_PREMIUM_PAID}).
     */
    public double getCurrentMultiplier() {
        int k = revealedSafe.size();
        if (k == 0) {
            return 1.0;
        }
        double fair = fairMultiplierForSafeReveals(k);
        return 1.0 + (fair - 1.0) * MULTIPLIER_PREMIUM_PAID;
    }

    /** Mathematically fair product ∏(T−j)/(S−j) for j = 0 … k−1 (no house edge). */
    private double fairMultiplierForSafeReveals(int k) {
        int t = totalCells;
        int s = safeCellCount;
        double mult = 1.0;
        for (int j = 0; j < k; j++) {
            mult *= (double) (t - j) / (double) (s - j);
        }
        return mult;
    }

    public boolean isFinished() {
        return status != MinesGameStatus.PLAYING;
    }

    /**
     * Payout for a finished winning round (cash-out or cleared all safe cells). Zero if lost or still playing.
     */
    public double getWinPayout() {
        if (status == MinesGameStatus.WON_CASHOUT) {
            return bet * getCurrentMultiplier();
        }
        return 0.0;
    }

    /**
     * Reveals one cell by linear index {@code row * cols + col}.
     *
     * @throws MinesIllegalMoveException if the round is over, index invalid, or cell already revealed
     */
    public void reveal(int cellIndex) {
        requirePlaying();
        if (cellIndex < 0 || cellIndex >= totalCells) {
            throw new MinesIllegalMoveException("cell index out of bounds");
        }
        if (revealedSafe.contains(cellIndex)) {
            throw new MinesIllegalMoveException("cell already revealed");
        }
        if (mineIndices.contains(cellIndex)) {
            status = MinesGameStatus.LOST;
            return;
        }
        revealedSafe.add(cellIndex);
        if (revealedSafe.size() == safeCellCount) {
            status = MinesGameStatus.WON_CASHOUT;
        }
    }

    /**
     * Ends the round with a payout at the current multiplier. Requires at least one safe reveal.
     *
     * @return chips to return ({@code bet * getCurrentMultiplier()})
     * @throws MinesIllegalMoveException if not playing, or no safe tile revealed yet
     */
    public double cashOut() {
        requirePlaying();
        if (revealedSafe.isEmpty()) {
            throw new MinesIllegalMoveException("reveal at least one safe cell before cash-out");
        }
        double payout = bet * getCurrentMultiplier();
        status = MinesGameStatus.WON_CASHOUT;
        return payout;
    }

    private void requirePlaying() {
        if (status != MinesGameStatus.PLAYING) {
            throw new MinesIllegalMoveException("round is not in PLAYING state");
        }
    }
}
