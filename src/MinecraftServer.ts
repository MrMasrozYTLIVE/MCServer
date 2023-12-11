import { PacketManager } from "./utils/PacketManager";
import {PlayerManager} from "./utils/PlayerManager";
import {Server} from "node:net"; // TODO: Replace with https://bun.sh/docs/api/tcp
import {PacketDisconnectKick} from "./packet/impl/player/PacketDisconnectKick";
import {Player} from "./Player";

export class MinecraftServer {
    public server: Server = new Server();
    public static debug: boolean = true;

    public static PlayerManagers = new Map<String, PlayerManager>();
    // EntityMap = new Map<Number, IEntity>();

    public async start() {
        this.server.listen(25565, async () => {
            await PacketManager.loadPackets();
            console.log('Listening!');
        });

        this.server.on('connection', socket => {
            if(MinecraftServer.debug) console.log('New connection!');

            new PlayerManager("Unknown", socket).handleConnection();
        });

        this.server.on('close', this.stop);
    }

    public stop() {
        PlayerManager.sendPacketToAll(new PacketDisconnectKick(`Server closed`))
        this.server.close();
    }
}

