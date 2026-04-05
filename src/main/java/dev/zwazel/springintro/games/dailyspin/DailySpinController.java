package dev.zwazel.springintro.games.dailyspin;

import dev.zwazel.springintro.games.dailyspin.DailySpinDtos.DailySpinResultResponse;
import dev.zwazel.springintro.games.dailyspin.DailySpinDtos.DailySpinStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/daily-spin")
@RequiredArgsConstructor
public class DailySpinController {

    private final DailySpinService dailySpinService;

    @GetMapping("/status")
    public ResponseEntity<DailySpinStatusResponse> status(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(dailySpinService.getStatus(principal.getUsername()));
    }

    @PostMapping
    public ResponseEntity<DailySpinResultResponse> spin(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(dailySpinService.spin(principal.getUsername()));
    }
}
