import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PlayerManager} from "../../../utils/PlayerManager";
import {MinecraftServer} from "../../../MinecraftServer";

export class PacketServerList extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.ServerList
        })
    }

    readData(reader: IReader, player: Player) {
        player.playerManager.kickPlayer(`Beta 1.7.3 Server§${MinecraftServer.PlayerManagers.size}§${MinecraftServer.MAX_PLAYERS}`);
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .toBuffer();
    }
}