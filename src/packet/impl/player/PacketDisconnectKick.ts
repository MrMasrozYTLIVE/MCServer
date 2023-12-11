import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import { PlayerManager } from "../../../utils/PlayerManager";

export class PacketDisconnectKick extends Packet {
    constructor(public reason: string) {
        super({
            packetID: PacketEnum.DisconnectKick
        })
    }

    readData(reader: IReader, player: Player) {
        player.playerManager.playerDisconnected();
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeString16(this.reason)
            .toBuffer();
    }
}