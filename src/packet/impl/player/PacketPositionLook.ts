import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";

export class PacketKick extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.PositionLook
        })
    }

    readData(reader: IReader, player: Player) {
        player.xPosition = reader.readDouble();
        player.yPosition = reader.readDouble();
        player.stance = reader.readDouble();
        player.zPosition = reader.readDouble();
        player.yaw = reader.readFloat();
        player.pitch = reader.readFloat();
        player.onGround = reader.readBool();
    }

    writeData() {
        const player: Player = this.options.player;

        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeDouble(player.xPosition)
            .writeDouble(player.stance)
            .writeDouble(player.yPosition)
            .writeDouble(player.zPosition)
            .writeLong(player.yaw)
            .writeLong(player.pitch)
            .writeBool(player.onGround)
            .toBuffer();
    }
}