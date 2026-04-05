package dev.zwazel.springintro.games.dailyspin;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Fixed wheel segments; {@link #index} order must match the frontend wheel.
 */
@Getter
@RequiredArgsConstructor
public enum DailySpinPrize {
    BRONZE(0, "Bronze", 1_000, 2_500),
    SILVER(1, "Silver", 2_500, 2_500),
    GOLD(2, "Gold", 5_000, 2_000),
    PLATINUM(3, "Platinum", 12_500, 1_500),
    JACKPOT(4, "Jackpot", 35_000, 1_000),
    MEGA(5, "Mega", 100_000, 500);

    private final int index;
    private final String label;
    private final int chips;
    /** Weight out of 10_000 (approximate probabilities). */
    private final int weightBps;

    static {
        int sum = 0;
        for (DailySpinPrize p : values()) {
            sum += p.weightBps;
        }
        if (sum != 10_000) {
            throw new IllegalStateException("DailySpinPrize weights must sum to 10000, got " + sum);
        }
    }
}
