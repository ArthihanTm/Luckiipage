package dev.zwazel.springintro.games.dailyspin;

import dev.zwazel.springintro.games.dailyspin.DailySpinDtos.DailySpinResultResponse;
import dev.zwazel.springintro.games.dailyspin.DailySpinDtos.DailySpinStatusResponse;
import dev.zwazel.springintro.user.User;
import dev.zwazel.springintro.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class DailySpinService {

    private static final int COOLDOWN_HOURS = 24;
    private final UserRepository userRepository;
    private final SecureRandom random = new SecureRandom();

    public DailySpinStatusResponse getStatus(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Instant now = Instant.now();
        Instant next = nextAvailableAt(user.getLastDailySpinAt());
        boolean canSpin = next == null || !now.isBefore(next);
        return new DailySpinStatusResponse(canSpin, user.getChipBalance(), canSpin ? null : next);
    }

    @Transactional
    public DailySpinResultResponse spin(String email) {
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Instant now = Instant.now();
        Instant next = nextAvailableAt(user.getLastDailySpinAt());
        if (next != null && now.isBefore(next)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Daily spin is not available yet.");
        }

        DailySpinPrize prize = rollPrize();
        user.setChipBalance(user.getChipBalance() + prize.getChips());
        user.setLastDailySpinAt(now);
        userRepository.save(user);

        Instant nextAfter = now.plus(COOLDOWN_HOURS, ChronoUnit.HOURS);
        return new DailySpinResultResponse(
                prize.getIndex(),
                prize.getLabel(),
                prize.getChips(),
                user.getChipBalance(),
                nextAfter
        );
    }

    private static Instant nextAvailableAt(Instant lastSpin) {
        if (lastSpin == null) {
            return null;
        }
        return lastSpin.plus(COOLDOWN_HOURS, ChronoUnit.HOURS);
    }

    private DailySpinPrize rollPrize() {
        int roll = random.nextInt(10_000);
        int acc = 0;
        for (DailySpinPrize p : DailySpinPrize.values()) {
            acc += p.getWeightBps();
            if (roll < acc) {
                return p;
            }
        }
        return DailySpinPrize.MEGA;
    }
}
