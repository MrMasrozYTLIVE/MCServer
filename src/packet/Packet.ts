import {PacketEnum} from "../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../Player";
import {Socket} from "node:net";

export class Packet {
    constructor(public options: IPacketOption) {
        options.name = PacketEnum[options.packetID].toString();
    }

    readData(reader: IReader, player: Player) {}
    writeData() {
        return createWriter(Endian.BE).toBuffer();
    }
}

export interface IPacketOption {
    player?: Player,
    packetID: PacketEnum,
    name?: string,
    kickReason?: string
}