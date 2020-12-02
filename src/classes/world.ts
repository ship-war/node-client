import {
  AuthenticateResponse,
  NetEntity,
  MapResponse,
  User,
  EntityType
} from '../models';

import { entityDistance } from '../utils';

export class World {
  private user: User;
  private lesGrosFonbous: Array<User>;
  private mapDefinition: MapResponse;

  constructor(authenticateResponse: AuthenticateResponse) {
    this.user = authenticateResponse.user;
    this.updateWorld(authenticateResponse);
  }

  /*
   *  COOL STUFF ABOUT THE WORLD
   */
  public get entities(): Array<NetEntity> { return this.mapDefinition.map.entities; }
  public get ship(): NetEntity { return this.user.entity; }
  public get player(): User { return this.user; }
  public get opponents(): Array<User> { return this.lesGrosFonbous; }
  public get radius(): number { return this.mapDefinition.map.radius; }

  private fillUserShip(user: User): void {
    for (const entity of this.entities) {
      if (entity.id === user.shipId) {
        user.entity = entity;
        return;
      }
    }
  }

  private updateUsers(mapDefinition: MapResponse): void {
    this.lesGrosFonbous = [];

    mapDefinition.users.forEach((user: User) => {
      this.fillUserShip(user);
      if (user.shipId === user.shipId) {
        this.user = user;
      } else {
        this.lesGrosFonbous.push(user);
      }
    }, this);
  }

  public updateWorld(mapDefinition: MapResponse): void {
    this.mapDefinition = mapDefinition;
    this.updateUsers(mapDefinition);
  }

  public update(): void {
    for (const entity of this.entities) {
      entity.position.x += entity.movement.direction.x * entity.movement.speed;
      entity.position.y += entity.movement.direction.y * entity.movement.speed;
    }
  }

  public getNearEntities(radius: number, ...types: Array<EntityType>): Array<NetEntity> {
    const ship: NetEntity = this.ship;

    return this.entities.reduce((entities: Array<NetEntity>, entity: NetEntity) => {
      if (
        ship.id !== entity.id &&
        entityDistance(ship, entity) <= radius &&
        (
          types.length === 0 ||
          types.includes(entity.type)
        )
      ) {
        entities.push(entity);
      }
      return entities;
    }, []);
  }
}
