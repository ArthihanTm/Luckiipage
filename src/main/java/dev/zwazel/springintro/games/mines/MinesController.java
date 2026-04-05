package dev.zwazel.springintro.games.mines;

import dev.zwazel.springintro.games.mines.MinesDtos.MinesCashOutResponse;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesRevealRequest;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesRevealResponse;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesStartRequest;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesStartResponse;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesStateResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mines")
@RequiredArgsConstructor
public class MinesController {

    private final MinesService minesService;

    @PostMapping("/start")
    public ResponseEntity<MinesStartResponse> start(@Valid @RequestBody MinesStartRequest request) {
        return ResponseEntity.ok(minesService.startGame(request));
    }

    @PostMapping("/{id}/reveal")
    public ResponseEntity<MinesRevealResponse> reveal(
            @PathVariable("id") String id,
            @Valid @RequestBody MinesRevealRequest body
    ) {
        return ResponseEntity.ok(minesService.reveal(id, body));
    }

    @PostMapping("/{id}/cash-out")
    public ResponseEntity<MinesCashOutResponse> cashOut(@PathVariable("id") String id) {
        return ResponseEntity.ok(minesService.cashOut(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MinesStateResponse> get(@PathVariable("id") String id) {
        return ResponseEntity.ok(minesService.getState(id));
    }
}
