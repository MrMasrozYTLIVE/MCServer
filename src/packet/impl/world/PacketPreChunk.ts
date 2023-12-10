import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PlayerManager} from "../../../utils/PlayerManager";

export class PacketPreChunk extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.PreChunk
        })
    }

    readData(reader: IReader, player: Player) {

    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeInt(0)
            .writeInt(0)
            .writeBool(true)
            .toBuffer();
    }
}