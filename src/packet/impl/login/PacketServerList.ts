import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PlayerManager} from "../../../utils/PlayerManager";

export class PacketServerList extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.ServerList
        })
    }

    readData(reader: IReader, player: Player) {
        PlayerManager.kickPlayer(player, `Beta 1.7.3 Server§0§0`);
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .toBuffer();
    }
}