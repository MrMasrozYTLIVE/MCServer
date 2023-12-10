import {Packet} from "../packet/Packet";
import {PacketEnum} from "./PacketEnum";
import { glob } from "glob";
import { normalize } from "path";
import { promisify } from "util";
import chalk from "chalk";

export class PacketManager {
    private static PacketMap = new Map<PacketEnum, Packet>();

    public static async loadPackets() {
        const packets = await promisify(glob)(normalize(__dirname + "/../packet/impl/**/*.{ts,js}"));
        for (const packetPath of packets) {
            let packet: MaybePacket = await import(packetPath);
            if ('default' in packet) packet = packet.default;
            if (packet.constructor.name === 'Object') packet = Object.values(packet)[0];

            const instance = new (packet as Constructor<Packet>)();

            const packetID = instance.options.packetID;
            const packetFromMap: Packet | undefined = this.PacketMap.get(packetID);

            if(packetFromMap == undefined) {
                this.PacketMap.set(packetID, instance);
                this.debug(`Loaded packet ${instance.options.name} with id ${packetID}!`, true)
            } else {
                this.debug(`Packet ${instance.options.name} (${packetPath}) with id ${packetID} is already loaded. Skipping!`, false)
            }
        }
    }

    private static debug(message: string, success: boolean) {
        console.log(
            chalk.bold(
                chalk.white("[") + chalk.magentaBright("PacketManager") + chalk.white("] ")
            ) + (
                success ? chalk.greenBright(message) : chalk.redBright(message)
            )
        )
    }

    public static getPacket(packetID: PacketEnum): any {
        return this.PacketMap.get(packetID);
    }
}

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;
export type MaybePacket = Constructor<Packet> | {default: Constructor<Packet>} | {[k: string]: Constructor<Packet>};