import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";

export class PacketPosition extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.Position
        })
    }

    readData(reader: IReader, player: Player) {
        player.updatePosition(
            reader.readDouble(), // X
            reader.readDouble(), // Y
            reader.readDouble(), // Stance
            reader.readDouble(), // Z
            undefined, // Yaw
            undefined, // Pitch
            reader.readBool() // onGround
        );
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .toBuffer();
    }
}