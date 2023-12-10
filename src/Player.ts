import {Socket} from "node:net";
import {IEntity} from "./IEntity";

export class Player implements IEntity {
    public entityID: Number;

    public xPosition: number = 0;
    public yPosition: number = 100;
    public stance: number = 102;
    public zPosition: number = 0;
    public yaw: number = 0;
    public pitch: number = 0;
    public onGround: boolean = false;

    constructor(public options: IPlayerOption) {}
}

export interface IPlayerOption {
    client: Socket,
    username: String
}