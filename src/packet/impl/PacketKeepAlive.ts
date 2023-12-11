import {Packet} from "../Packet";
import {PacketEnum} from "../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../Player";
import {PlayerManager} from "../../utils/PlayerManager";

export class PacketKeepAlive extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.KeepAlive
        })
    }

    readData(reader: IReader, player: Player) {
        player.playerManager.sendPacket(this);
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .toBuffer();
    }
}