import {PacketEnum} from "../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../Player";
import {Socket} from "node:net";
import {Entity} from "../Entity";
import {IEntity} from "../IEntity";

export class Packet {
    constructor(public options: IPacketOption) {
        options.name = PacketEnum[options.packetID].toString();
    }

    readData(reader: IReader, entity: IEntity) {}
    writeData() {
        return createWriter(Endian.BE).toBuffer();
    }
}

export interface IPacketOption {
    player?: Player,
    packetID: PacketEnum,
    name?: string,
}