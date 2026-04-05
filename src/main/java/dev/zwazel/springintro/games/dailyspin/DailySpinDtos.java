package dev.zwazel.springintro.games.dailyspin;

import java.time.Instant;

public final class DailySpinDtos {

    private DailySpinDtos() {}

    public record DailySpinStatusResponse(
            boolean canSpin,
            long chipBalance,
            Instant nextSpinAvailableAt
    ) {}

    public record DailySpinResultResponse(
            int segmentIndex,
            String segmentLabel,
            int rewardChips,
            long chipBalance,
            Instant nextSpinAvailableAt
    ) {}
}
