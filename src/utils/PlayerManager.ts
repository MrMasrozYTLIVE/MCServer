import {Player} from "../Player";
import {Packet} from "../packet/Packet";
import {PacketDisconnectKick} from "../packet/impl/player/PacketDisconnectKick";
import {PacketChat} from "../packet/impl/player/PacketChat";
import {Socket} from "node:net";
import {createReader, Endian} from "bufferstuff";
import {PacketManager} from "./PacketManager";
import {MinecraftServer} from "../MinecraftServer";

export class PlayerManager {
    static PlayerMap = new Map<Socket, Player>();
    static SocketMap = new Map<String, Socket>();

    public static handleConnection(socket: Socket) {
        if(!PlayerManager.PlayerMap.has(socket)) PlayerManager.PlayerMap.set(socket, new Player({
            client: socket,
            username: "Unknown"
        }));

        socket.on('data', data => {
            const reader = createReader(Endian.BE, data);

            const packetID = reader.readUByte();
            let packet: Packet;
            packet = PacketManager.getPacket(packetID);

            if(packet === undefined) {
                if(MinecraftServer.debug) console.log(`Received Unknown packet: ${packetID}. Kicking the player.`);
                PlayerManager.kickPlayer(PlayerManager.PlayerMap.get(socket), `Sent unknown packet ${packetID}`);
                return;
            }

            if(MinecraftServer.debug) console.log(`Received Packet: ${packet.options.name} (${packetID})`);

            packet.readData(reader, PlayerManager.PlayerMap.get(socket));
        });

        socket.on('close', PlayerManager.playerDisconnected);
        socket.on('timeout', PlayerManager.playerDisconnected);
    }

    public static sendPacket(player: Player, packet: Packet) {
        if(!packet || !player) {
            console.log(`Tried to sent packet to player where either player or packet is null!`)
            return;
        }

        if(MinecraftServer.debug) console.log(`Sending Packet: ${packet.options.name} (${packet.options.packetID}) to ${player.options.username}`);
        packet.options.player = player;

        player.options.client.write(packet.writeData());
    }

    public static sendPacketToAll(packet: Packet) {
        PlayerManager.PlayerMap.forEach(player => {
            PlayerManager.sendPacket(player, packet);
        })
    }

    public static kickPlayer(player: Player, reason: string) {
        if(!player) {
            console.log(`Tried to kick null player!`);
            return;
        }

        PlayerManager.sendPacket(player, new PacketDisconnectKick(reason));
        this.playerDisconnected(player.options.client);
    }

    public static playerDisconnected(socket: Socket) {
        const player = PlayerManager.PlayerMap.get(socket);
        if(!player) return;

        const username = player.options.username;
        if(MinecraftServer.debug) console.log(`Player ${username} left. Deleting from the map!`);
        PlayerManager.SocketMap.delete(username);
        PlayerManager.PlayerMap.delete(socket);

        PlayerManager.sendPacketToAll(new PacketChat(`§e<${username}> left the game.`));
    }

    public static getPlayer(username: String) {
        return PlayerManager.PlayerMap.get(PlayerManager.SocketMap.get(username));
    }
}