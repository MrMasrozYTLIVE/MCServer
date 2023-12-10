import { PacketManager } from "./utils/PacketManager";
import {PlayerManager} from "./utils/PlayerManager";
import {Server} from "node:net";
import {PacketDisconnectKick} from "./packet/impl/player/PacketDisconnectKick";

export class MinecraftServer {
    public server: Server = new Server();
    public static debug: boolean = true;

    // EntityMap = new Map<Number, IEntity>();

    public async start() {
        this.server.listen(25565, async () => {
            await PacketManager.loadPackets();
            console.log('Listening!');
        });

        this.server.on('connection', socket => {
            if(MinecraftServer.debug) console.log('New connection!');

            PlayerManager.handleConnection(socket);
        });
    }

    public stop() {
        PlayerManager.sendPacketToAll(new PacketDisconnectKick(`Server closed`))
        this.server.close();
    }
}

