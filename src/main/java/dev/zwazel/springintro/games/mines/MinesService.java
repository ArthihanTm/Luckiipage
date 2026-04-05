package dev.zwazel.springintro.games.mines;

import dev.zwazel.springintro.games.mines.MinesDtos.MinesCashOutResponse;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesRevealRequest;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesRevealResponse;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesStartRequest;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesStartResponse;
import dev.zwazel.springintro.games.mines.MinesDtos.MinesStateResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MinesService {

    private final Map<String, MinesGame> games = new ConcurrentHashMap<>();

    public MinesStartResponse startGame(MinesStartRequest request) {
        MinesGame game = MinesGame.createNew(request.bet(), request.rows(), request.cols(), request.mineCount());
        games.put(game.getId(), game);
        return toStartResponse(game);
    }

    public MinesRevealResponse reveal(String gameId, MinesRevealRequest body) {
        MinesGame game = requireGame(gameId);
        if (body.row() >= game.getRows() || body.col() >= game.getCols()) {
            throw new MinesIllegalMoveException("row or col out of bounds");
        }
        int index = body.row() * game.getCols() + body.col();
        game.reveal(index);
        return toRevealResponse(game);
    }

    public MinesCashOutResponse cashOut(String gameId) {
        MinesGame game = requireGame(gameId);
        double payout = game.cashOut();
        return new MinesCashOutResponse(
                game.getStatus(),
                payout,
                sortedCopy(game.getRevealedSafeIndices()),
                sortedCopy(game.getMineIndices())
        );
    }

    public MinesStateResponse getState(String gameId) {
        MinesGame game = requireGame(gameId);
        return toStateResponse(game);
    }

    private MinesGame requireGame(String gameId) {
        MinesGame game = games.get(gameId);
        if (game == null) {
            throw new MinesNotFoundException("Mines game not found: " + gameId);
        }
        return game;
    }

    private static MinesStartResponse toStartResponse(MinesGame game) {
        return new MinesStartResponse(
                game.getId(),
                game.getStatus(),
                game.getRows(),
                game.getCols(),
                game.getMineCount(),
                game.getBet(),
                sortedCopy(game.getRevealedSafeIndices()),
                game.getCurrentMultiplier()
        );
    }

    private static MinesRevealResponse toRevealResponse(MinesGame game) {
        boolean hitMine = game.getStatus() == MinesGameStatus.LOST;
        List<Integer> mines = game.getStatus() == MinesGameStatus.PLAYING ? null : sortedCopy(game.getMineIndices());
        double payout = game.getStatus() == MinesGameStatus.WON_CASHOUT ? game.getWinPayout() : 0.0;
        return new MinesRevealResponse(
                game.getStatus(),
                sortedCopy(game.getRevealedSafeIndices()),
                game.getCurrentMultiplier(),
                hitMine,
                mines,
                payout
        );
    }

    private static MinesStateResponse toStateResponse(MinesGame game) {
        List<Integer> minesIfDone = game.getStatus() == MinesGameStatus.PLAYING ? null : sortedCopy(game.getMineIndices());
        return new MinesStateResponse(
                game.getId(),
                game.getStatus(),
                game.getRows(),
                game.getCols(),
                game.getMineCount(),
                game.getBet(),
                sortedCopy(game.getRevealedSafeIndices()),
                game.getCurrentMultiplier(),
                minesIfDone
        );
    }

    private static List<Integer> sortedCopy(Set<Integer> set) {
        return set.stream().sorted().toList();
    }
}
