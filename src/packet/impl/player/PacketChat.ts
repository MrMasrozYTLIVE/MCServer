import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PlayerManager} from "../../../utils/PlayerManager";
import {PacketPreChunk} from "../world/PacketPreChunk";
import {PacketPositionLook} from "./PacketPositionLook";

export class PacketChat extends Packet {
    constructor(public message: string) {
        super({
            packetID: PacketEnum.Chat
        })
    }

    readData(reader: IReader, player: Player) {
        const msg = reader.readString16();
        this.message = `<${player.username}> ${msg}`

        if(msg.startsWith("/")) {
            this.handleCommand(player, msg);
            return;
        }
        PlayerManager.sendPacketToAll(this);


    }

    handleCommand(player: Player, msg: string) {
        if(!msg.startsWith("/")) return;
        const cmd = msg.replace("/", "").split(" ");
        if(cmd.length < 1) {
            this.message = "Unknown command!";
            return player.playerManager.sendPacket(this)
        }
        if(cmd[0] == "tp") {
            player.xPosition = 0;
            player.yPosition = 100;
            player.zPosition = 0;
            player.playerManager.sendPacket(new PacketPositionLook())
        }
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeString16(this.message)
            .toBuffer();
    }
}