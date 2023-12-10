import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {randomInt} from "node:crypto";
import {PlayerManager} from "../../../utils/PlayerManager";

export class PacketHandshake extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.Handshake
        })
    }

    readData(reader: IReader, player: Player) {
        const username = reader.readString16();
        if(PlayerManager.getPlayer(username)) {
            PlayerManager.kickPlayer(player, `Player with same username is already on the server.`);
            return;
        }

        if(username.length > 16) {
            PlayerManager.kickPlayer(player, `Your username is too long!`);
            return;
        }

        player.options.username = username;
        player.entityID = randomInt(0, 100);

        PlayerManager.SocketMap.set(username, player.options.client);

        PlayerManager.sendPacket(player, this);
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeString16("-")
            .toBuffer();
    }
}