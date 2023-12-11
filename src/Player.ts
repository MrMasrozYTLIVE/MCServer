import {Socket} from "node:net";
import {IEntity} from "./IEntity";
import {PlayerManager} from "./utils/PlayerManager";

export class Player implements IEntity {
    public entityID: Number;
    public username: String;
    public socket: Socket;
    public playerManager: PlayerManager;

    public xPosition: number = 0;
    public yPosition: number = 100;
    public stance: number = 102;
    public zPosition: number = 0;
    public yaw: number = 0;
    public pitch: number = 0;
    public onGround: boolean = false;

    constructor(username: String, socket: Socket, playerManager: PlayerManager) {
        this.username = username;
        this.socket = socket;
        this.playerManager = playerManager;
    }
}