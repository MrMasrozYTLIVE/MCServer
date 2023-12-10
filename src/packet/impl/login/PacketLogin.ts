import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {PacketManager} from "../../../utils/PacketManager";
import {PacketChat} from "../player/PacketChat";
import {PlayerManager} from "../../../utils/PlayerManager";
import {PacketPreChunk} from "../world/PacketPreChunk";
import {PacketMapChunk} from "../world/PacketMapChunk";

export class PacketHandshake extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.Login
        })
    }

    readData(reader: IReader, player: Player) {
        const protocol = reader.readInt();
        if(protocol > 14) PlayerManager.kickPlayer(player, `Server is outdated!`);
        else if (protocol < 14) PlayerManager.kickPlayer(player, `Client is outdated!`);

        const username = reader.readString16();
        const seed = reader.readLong();
        const dimension = reader.readByte();
        PlayerManager.sendPacket(player, this);
        PlayerManager.sendPacket(player, PacketManager.getPacket(PacketEnum.PositionLook));
        PlayerManager.sendPacketToAll(new PacketChat(`§e<${username}> has joined the game.`));

        PlayerManager.sendPacket(player, new PacketPreChunk());
        PlayerManager.sendPacket(player, new PacketMapChunk());
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeInt(1)
            .writeString16("-")
            .writeLong(0)
            .writeByte(0)
            .toBuffer();
    }
}