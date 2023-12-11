import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {randomInt} from "node:crypto";
import {PlayerManager} from "../../../utils/PlayerManager";
import {MinecraftServer} from "../../../MinecraftServer";
import {Socket} from "node:net";

export class PacketHandshake extends Packet {
    constructor(public playerManager: PlayerManager) {
        super({
            packetID: PacketEnum.Handshake
        })
    }

    readData(reader: IReader, player: Player) {
        const username = reader.readString16();

        player = this.playerManager.player;
        this.playerManager.username = username;
        player.username = username;

        if(PlayerManager.getPlayer(username)) {
            player.playerManager.kickPlayer(`Player with same username is already on the server.`);
            return;
        }

        if(username.length > 16) {
            player.playerManager.kickPlayer(`Your username is too long!`);
            return;
        }

        player.username = username;
        player.entityID = randomInt(0, 100);

        MinecraftServer.PlayerManagers.set(username, player.playerManager);

        player.playerManager.sendPacket(this);
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeString16("-")
            .toBuffer();
    }
}