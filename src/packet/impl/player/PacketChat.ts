import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PlayerManager} from "../../../utils/PlayerManager";
import {PacketPreChunk} from "../world/PacketPreChunk";

export class PacketChat extends Packet {
    constructor(public message: string) {
        super({
            packetID: PacketEnum.Chat
        })
    }

    readData(reader: IReader, player: Player) {
        this.message = `<${player.options.username}> ${reader.readString16()}`

        PlayerManager.sendPacketToAll(this);
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeString16(this.message)
            .toBuffer();
    }
}