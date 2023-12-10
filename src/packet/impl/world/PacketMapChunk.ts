import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {deflate} from "node:zlib";
import * as zlib from "zlib";

export class PacketMapChunk extends Packet {
    constructor() {
        super({
            packetID: PacketEnum.MapChunk
        })
    }

    readData(reader: IReader, player: Player) {
    }

    writeData() {
        const world = createWriter(Endian.BE);

        for(let x = 0; x < 256; x++) {
            for(let i = 0; i < 10; i++) {
                world.writeByte(1);
            }

            for(let i = 0; i < 118; i++) {
                world.writeByte(0);
            }
        }

        const buf = zlib.deflateSync(world.toBuffer());

        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeInt(0)
            .writeShort(0)
            .writeInt(0)
            .writeByte(15)
            .writeByte(127)
            .writeByte(15)
            .writeInt(buf.length)
            .writeBuffer(buf)
            .toBuffer();
    }
}