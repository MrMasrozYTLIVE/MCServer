import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PlayerManager} from "../../../utils/PlayerManager";
import {Entity} from "../../../Entity";

export class PacketEntityPositionLook extends Packet {
    constructor(private entityID: number, private dX: number, private dY: number, private dZ: number, private yaw: number, private pitch: number) {
        super({
            packetID: PacketEnum.EntityPositionLook
        })
    }

    readData(reader: IReader, entity: Entity) {

    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeInt(this.entityID)
            .writeByte(this.dX)
            .writeByte(this.dY)
            .writeByte(this.dZ)
            .writeByte(this.yaw)
            .writeByte(this.pitch)
            .toBuffer();
    }
}