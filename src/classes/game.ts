import * as moment from 'moment';
import GameService from '../service/game-service';
import HttpService from '../service/http-service';
import {
  AuthenticateResponse, User, APIError, MapResponse
} from '../models';
import { World } from './world';
import { AI } from 'src/player/ai';

const FPS: number = 60;

export class Game {
  private isRunning: boolean = false;
  private readonly world: World;
  private readonly timeBetweenFrame: number;
  private readonly playerAI: AI;

  constructor(authenticateResponse: AuthenticateResponse) {
    this.timeBetweenFrame = 1000 / FPS;
    this.world = new World(authenticateResponse);
    this.playerAI = new AI(this.world);
  }

  public start(): void {
    this.isRunning = true;
    console.log('Starting game...');
    HttpService.onDeath(() => {
      console.log('YOU ARE DEAD ! (And weak)');
      this.isRunning = false;
    });
    this.nextTick();
    this.updateMap();
  }

	private nextTick(): void {
    if (!this.isRunning) {
      return;
    }
		const start: number = moment().valueOf();
		this.update();
		const elapsedTime: number = moment().valueOf() - start;

		if (elapsedTime > this.timeBetweenFrame) {
			this.nextTick();
		} else {
			setTimeout(() => this.nextTick(), this.timeBetweenFrame - elapsedTime);
		}
	}

  private update(): void {
    this.playerAI.update();
    this.world.update();
  }

  private updateMap(): void {
    GameService.getMap().then(
      (response: MapResponse) => {
        this.world.updateWorld(response);
        setTimeout(() => this.updateMap(), 100);
      }, (error: APIError) => {
        console.log(error);
        this.isRunning = false;
      }
    );
  }
}
