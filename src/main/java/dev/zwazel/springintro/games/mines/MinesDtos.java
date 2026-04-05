package dev.zwazel.springintro.games.mines;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

import java.util.List;

/**
 * Request and response records for the Mines API. Mine positions are omitted while {@link MinesGameStatus#PLAYING}.
 */
public final class MinesDtos {

    private MinesDtos() {}

    public record MinesStartRequest(
            @Positive double bet,
            @Positive int mineCount,
            @Min(2) @Max(24) int rows,
            @Min(2) @Max(24) int cols
    ) {}

    public record MinesStartResponse(
            String gameId,
            MinesGameStatus status,
            int rows,
            int cols,
            int mineCount,
            double bet,
            List<Integer> revealedSafeIndices,
            double currentMultiplier
    ) {}

    public record MinesRevealRequest(
            @Min(0) int row,
            @Min(0) int col
    ) {}

    /**
     * @param mineIndices {@code null} while the round is still {@link MinesGameStatus#PLAYING} (no leak).
     * @param payout      win amount when status is {@link MinesGameStatus#WON_CASHOUT}; otherwise {@code 0}.
     */
    public record MinesRevealResponse(
            MinesGameStatus status,
            List<Integer> revealedSafeIndices,
            double currentMultiplier,
            boolean hitMine,
            List<Integer> mineIndices,
            double payout
    ) {}

    public record MinesCashOutResponse(
            MinesGameStatus status,
            double payout,
            List<Integer> revealedSafeIndices,
            List<Integer> mineIndices
    ) {}

    /**
     * @param mineIndicesIfFinished {@code null} while {@link MinesGameStatus#PLAYING}.
     */
    public record MinesStateResponse(
            String gameId,
            MinesGameStatus status,
            int rows,
            int cols,
            int mineCount,
            double bet,
            List<Integer> revealedSafeIndices,
            double currentMultiplier,
            List<Integer> mineIndicesIfFinished
    ) {}
}
