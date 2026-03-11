# Blackjack Game Documentation

## Introduction
This document serves as comprehensive documentation for the blackjack game implementation within the Luckiipage project. The blackjack game is designed to mimic the traditional card game of blackjack and allows users to play against the dealer.

## Architecture
The architecture of the blackjack game is designed with a focus on modularity and scalability. The main components include:

- **Game Engine**: Manages the game flow and logic, including dealing cards, determining the winner, and handling bets.
- **Player Interface**: Allows users to interact with the game and view their status, scores, and actions available.
- **Server**: Utilizes a RESTful API to handle client requests and communicate with the game engine.

## Components
1. **Card Deck**: Represents a standard deck of cards, which can be shuffled and dealt.
2. **Player Class**: Handles player-specific logic, including their hand, score, and betting amounts.
3. **Dealer Class**: Represents the dealer's logic and actions.
4. **Game Logic**: Contains the rules of blackjack, such as hitting, standing, and scoring.
5. **REST API**: Exposes endpoints for game actions and retrieving game states.

## Game Logic Flow
1. The game begins by shuffling the deck.
2. Players place their bets.
3. Each player and the dealer are dealt two cards.
4. Players take turns to hit or stand.
5. The dealer plays according to standard rules.
6. The game determines the winners and payouts.

## REST API Endpoints
- `POST /api/game/start`: Initiates a new game.
- `POST /api/game/hit`: Allows a player to take another card.
- `POST /api/game/stand`: Allows a player to hold their cards.
- `GET /api/game/status`: Retrieves the current status of the game.

## Security Implementation
The application implements JSON Web Tokens (JWT) for secure user authentication. JWT is used to protect REST API endpoints, ensuring that only authenticated users can access certain game functionalities.

- **Login Endpoint**: `POST /api/login` provides a token upon successful authentication.
- **Token Validation**: Each request to protected endpoints requires a valid JWT in the headers.

## Getting Started Guide
1. Clone the repository: `git clone https://github.com/Kooryl/Luckiipage.git`
2. Navigate to the project directory: `cd Luckiipage`
3. Install dependencies: `npm install`
4. Start the application: `npm start`
5. Access the game through the provided REST API endpoints.

For further information, please refer to the project's documentation or contact the development team.