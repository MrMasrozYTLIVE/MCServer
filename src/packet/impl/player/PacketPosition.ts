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
        player.xPosition = reader.readDouble();
        player.yPosition = reader.readDouble();
        player.stance = reader.readDouble();
        player.zPosition = reader.readDouble();
        player.onGround = reader.readBool();
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .toBuffer();
    }
}