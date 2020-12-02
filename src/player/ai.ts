import { World } from '../classes/world';
import { ActionManager } from '../classes/action-manager';
import { Vector } from '../models';

export const PLAYER_NAME: string = 'Lorin';

export class AI {
  private readonly world: World;
  private actionManager: ActionManager;

  constructor(world: World) {
    this.world = world;
    this.actionManager = new ActionManager(world);
  }

  public canShot(): boolean { return this.actionManager.canShot(); }
  public fire(target: Vector): Promise<boolean> { return this.actionManager.quickFire(target); }
  public setSpeed(power: number): Promise<boolean> { return this.actionManager.quickSetPowerSpeed(power); }
  public setDirection(target: Vector): Promise<boolean> { return this.actionManager.quickSetDirection(target); }
  
  public moveToward(target: Vector, speed: number = 100): Promise<void> {
    return this.actionManager.setDirection(target).setPowerSpeed(speed).send() as Promise<any>;
  }

  public update(): void {
    /*
     *  YOUR CODE HERE
     */
  }
}
