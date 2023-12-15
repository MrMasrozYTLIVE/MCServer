import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";

export class PacketLook extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.Look
        })
    }

    readData(reader: IReader, player: Player) {
        player.updatePosition(
            undefined, // X
            undefined, // Y
            undefined, // Stance
            undefined, // Z
            reader.readFloat(), // Yaw
            reader.readFloat(), // Pitch
            reader.readBool() // onGround
        );
    }

    writeData() {
        const player: Player = this.options.player;

        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeLong(player.yaw)
            .writeLong(player.pitch)
            .writeBool(player.onGround)
            .toBuffer();
    }
}