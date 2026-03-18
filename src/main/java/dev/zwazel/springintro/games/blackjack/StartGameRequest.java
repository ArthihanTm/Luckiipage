/*
 * Needed before this file:
 * - none
 *
 * TODO (superficial):
 * - add bet field
 * - validate bet > 0
 * - keep request minimal
 */
public class StartGameRequest {
    private double bet;

    public StartGameRequest(double bet) {
        setBet(bet);
    }

    public double getBet() {
        return bet;
    }

    public void setBet(double bet) {
        if (bet <= 0) {
            throw new IllegalArgumentException("Bet must be greater than 0");
        }
        this.bet = bet;
    }
}