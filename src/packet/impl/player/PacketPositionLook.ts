import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader, IWriter} from "bufferstuff";
import {Player} from "../../../Player";

export class PacketPositionLook extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.PositionLook
        })
    }

    readData(reader: IReader, player: Player) {
        player.updatePosition(
            reader.readDouble(), // X
            reader.readDouble(), // Y
            reader.readDouble(), // Stance
            reader.readDouble(), // Z
            reader.readFloat(), // Yaw
            reader.readFloat(), // Pitch
            reader.readBool() // onGround
        );
    }

    writeData() {
        const player: Player = this.options.player;

        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeDouble(player.xPosition)
            .writeDouble(player.stance)
            .writeDouble(player.yPosition)
            .writeDouble(player.zPosition)
            .writeFloat(player.yaw)
            .writeFloat(player.pitch)
            .writeBool(player.onGround)
            .toBuffer();
    }
}