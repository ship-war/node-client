import GameService from '../service/game-service';
import { World } from './world';
import * as moment from 'moment';
import {
  APIError,
  DoActionRequest,
  DoActionResponse,
  Vector,
  Action
} from '../models';

const RELOAD_TIME: number = 500;
const MAX_SPEED: number = 10;

export class ActionManager {
  private readonly world: World;
  private request: DoActionRequest = {};
  private lastShot: number = 0;

  constructor(world: World) {
    this.world = world;
  }

  public canShot(): boolean {
    return moment().valueOf() - this.lastShot >= RELOAD_TIME;
  }

  public setDirection(direction: Vector): this {
    this.request['SET_DIRECTION'] = {
      type: 'SET_DIRECTION',
      directionType: 'POINT',
      point: direction
    } as Action;
    return this;
  }

  public setPowerSpeed(power: number): this {
    this.request['SET_SPEED'] = {
      type: 'SET_SPEED',
      power
    } as Action;
    return this;
  }

  public fire(target: Vector): this {
    this.request['FIRE'] = {
      type: 'FIRE',
      directionType: 'POINT',
      point: target
    } as Action;
    return this;
  }

  public async send(): Promise<DoActionResponse> {
    if (Object.keys(this.request).length === 0) {
      return {};
    }

    const request: DoActionRequest = {
      ...this.request
    };

    this.request = {};

    return GameService.doAction(request).then(
      (response: DoActionResponse) => {
        if (response['FIRE'] && response['FIRE'].done) {
          this.lastShot = moment().valueOf();
        }
        if (
          response['SET_DIRECTION'] &&
          response['SET_DIRECTION'].done &&
          response['SET_DIRECTION'].data) {
          this.world.ship.movement.direction = response['SET_DIRECTION'].data.direction;
        }
        if (
          response['SET_SPEED'] &&
          response['SET_SPEED'].done &&
          response['SET_SPEED'].data) {
          this.world.ship.movement.speed = response['SET_SPEED'].data.speed;
        }
        return response;
      }, (error: APIError) => {
        throw error;
      }
    );
  }

  public quickSetDirection(direction: Vector): Promise<boolean> {
    return this.setDirection(direction).send().then(
      (response: DoActionResponse) => {
        return !!(response['SET_DIRECTION'] && response['SET_DIRECTION'].done);
      }, (error: APIError) => {
        return false;
      }
    );
  }

  public quickSetPowerSpeed(power: number): Promise<boolean> {
    return this.setPowerSpeed(power).send().then(
      (response: DoActionResponse) => {
        return !!(response['SET_SPEED'] && response['SET_SPEED'].done);
      }, (error: APIError) => {
        return false;
      }
    );
  }

  public quickFire(target: Vector): Promise<boolean> {
    return this.fire(target).send().then(
      (response: DoActionResponse) => {
        return !!(response['FIRE'] && response['FIRE'].done);
      }, (error: APIError) => {
        return false;
      }
    );
  }
}
