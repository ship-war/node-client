import GameService from './service/game-service';
import { Game } from './classes/game';
import { PLAYER_NAME } from './player/ai';
import {
  AuthenticateResponse,
  APIError,
} from './models';

GameService.authenticate(PLAYER_NAME).then(
  (response: AuthenticateResponse) => {
    const game: Game = new Game(response);
    game.start();
  }, (error: APIError) => {
    console.log('An error occured FUCKING BASTARD !');
  }
);
