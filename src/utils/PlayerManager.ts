import {Player} from "../Player";
import {Packet} from "../packet/Packet";
import {PacketDisconnectKick} from "../packet/impl/player/PacketDisconnectKick";
import {PacketChat} from "../packet/impl/player/PacketChat";
import {Socket} from "node:net";
import {createReader, Endian} from "bufferstuff";
import {PacketManager} from "./PacketManager";
import {MinecraftServer} from "../MinecraftServer";
import {PacketEnum} from "./PacketEnum";
import {PacketHandshake} from "../packet/impl/login/PacketHandshake";

export class PlayerManager {
    public player: Player;

    constructor(public username: string, public socket: Socket) {
        this.player = new Player(username, socket, this);
    }

    public handleConnection() {
        this.socket.on('data', data => {
            const reader = createReader(Endian.BE, data);

            const packetID = reader.readUByte();
            if(packetID == PacketEnum.Handshake) {
                new PacketHandshake(this).readData(reader, null);
                return;
            }

            let packet: Packet = PacketManager.getPacket(packetID);

            if(packet === undefined) {
                if(MinecraftServer.debug) console.log(`Received Unknown packet: ${packetID}. Kicking the player.`);
                // this.kickPlayer(`Sent unknown packet ${packetID}`);
                return;
            }

            if(MinecraftServer.debug && packetID != PacketEnum.Position && packetID != PacketEnum.PositionLook)
                console.log(`Received Packet: ${packet.options.name} (${packetID})`);

            packet.readData(reader, this.player);
        });

        this.socket.on('close', () => this.playerDisconnected());
        this.socket.on('timeout', () => this.playerDisconnected());
        this.socket.on('error', () => this.playerDisconnected());
    }

    public sendPacket(packet: Packet) {
        if(!packet) {
            console.log(`Tried to sent null packet!`)
            return;
        }

        if(MinecraftServer.debug) console.log(`Sending Packet: ${packet.options.name} (${packet.options.packetID}) to ${this.username}`);
        packet.options.player = this.player;

        this.player.socket.write(packet.writeData());
    }

    public static sendPacketToAll(packet: Packet) {
        MinecraftServer.PlayerManagers.forEach(manager => {
            manager.sendPacket(packet);
        })
    }

    public kickPlayer(reason: string) {
        this.sendPacket(new PacketDisconnectKick(reason));
    }

    public playerDisconnected() {
        if(MinecraftServer.debug) console.log(`Player ${this.username} left. Deleting from the map!`);
        MinecraftServer.PlayerManagers.delete(this.username);

        PlayerManager.sendPacketToAll(new PacketChat(`§e<${this.username}> left the game.`));
    }

    public static getPlayer(username: String) {
        return MinecraftServer.PlayerManagers.get(username)?.player;
    }
}