package dev.zwazel.springintro.games.blackjack;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blackjack")
@RequiredArgsConstructor
public class BlackjackController {
    private final BlackjackService blackjackService;

    @PostMapping("/start")
    public ResponseEntity<GameResponse> start(@RequestBody StartGameRequest request) {
        return ResponseEntity.ok(blackjackService.startGame(request));
    }

    @PostMapping("/{id}/hit")
    public ResponseEntity<GameResponse> hit(@PathVariable("id") String id) {
        return ResponseEntity.ok(blackjackService.hit(id));
    }

    @PostMapping("/{id}/stand")
    public ResponseEntity<GameResponse> stand(@PathVariable("id") String id) {
        return ResponseEntity.ok(blackjackService.stand(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponse> get(@PathVariable("id") String id) {
        return ResponseEntity.ok(blackjackService.getGame(id));
    }
}
