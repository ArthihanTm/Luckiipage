package dev.zwazel.springintro.games.blackjack;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/blackjack")
public class BlackjackController {

    private final BlackjackService blackjackService;

    public BlackjackController(BlackjackService blackjackService) {
        this.blackjackService = blackjackService;
    }

    @PostMapping("/start")
    public ResponseEntity<GameResponse> startGame(@RequestBody StartGameRequest request) {
        GameResponse response = blackjackService.startGame(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/hit")
    public ResponseEntity<?> hit(@PathVariable String id) {
        try {
            GameResponse response = blackjackService.hit(id);
            return ResponseEntity.ok(response);
        } catch (GameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/stand")
    public ResponseEntity<?> stand(@PathVariable String id) {
        try {
            GameResponse response = blackjackService.stand(id);
            return ResponseEntity.ok(response);
        } catch (GameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGame(@PathVariable String id) {
        try {
            GameResponse response = blackjackService.getGame(id);
            return ResponseEntity.ok(response);
        } catch (GameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
