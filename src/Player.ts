import {Socket} from "node:net";
import {IEntity} from "./IEntity";
import {PlayerManager} from "./utils/PlayerManager";
import {Entity} from "./Entity";
import {PacketEntityPositionLook} from "./packet/impl/entity/PacketEntityPositionLook";
import {PacketEntityTeleport} from "./packet/impl/entity/PacketEntityTeleport";

export class Player extends Entity {
    public username: String;
    public socket: Socket;
    public playerManager: PlayerManager;

    public xPosition: number = 0;
    public prevXPosition: number = this.xPosition;
    public yPosition: number = 140;
    public prevYPosition: number = this.yPosition;
    public zPosition: number = 0;
    public prevZPosition: number = this.zPosition;
    public stance: number = 102;
    public yaw: number = 0;
    public pitch: number = 0;
    public onGround: boolean = false;

    constructor(username: String, socket: Socket, playerManager: PlayerManager) {
        super();
        this.username = username;
        this.socket = socket;
        this.playerManager = playerManager;
    }

    public updatePosition(x?: number, y?: number, stance?: number, z?: number, yaw?: number, pitch?: number, onGround?: boolean) {
        if(x) {
            this.prevXPosition = this.xPosition;
            this.xPosition = x;
        }
        if(y && stance) {
            this.prevYPosition = this.yPosition;
            this.yPosition = y;
            this.stance = stance;

            const sy = stance - y;
            if(sy < 0.1 || sy > 1.65) this.playerManager.kickPlayer("Illegal Stance");
        }
        if(z) {
            this.prevZPosition = this.zPosition;
            this.zPosition = z;
        }
        if(yaw) this.yaw = yaw;
        if(pitch) this.pitch = pitch;
        if(onGround != undefined) this.onGround = onGround;

        // console.log(this.toString());
        PlayerManager.sendPacketToAll(new PacketEntityTeleport(this.entityID, this.xPosition, this.yPosition, this.zPosition, 0, 0))
    }

    public toString() {
        return `[Player ${this.username}] X=${this.xPosition},Y=${this.yPosition},stance=${this.stance},` +
            `Z=${this.zPosition},yaw=${this.yaw},pitch=${this.pitch},onGround=${this.onGround}`;
    }
}