import {Packet} from "../../Packet";
import {PacketEnum} from "../../../utils/PacketEnum";
import {createWriter, Endian, IReader} from "bufferstuff";
import {Player} from "../../../Player";
import {deflate} from "node:zlib";
import * as zlib from "zlib";

export class PacketMapChunk extends Packet {
    public world: Buffer;

    constructor() {
        super({
            packetID: PacketEnum.MapChunk
        })

        const chunk = createWriter(Endian.BE);

        for(let x = 0; x < 256; x++) {
            for(let i = 0; i < 90; i++) {
                chunk.writeByte(1);
            }

            for(let i = 0; i < 38; i++) {
                chunk.writeByte(0);
            }
        }

        this.world = zlib.deflateSync(chunk.toBuffer());
    }

    readData(reader: IReader, player: Player) {
    }

    writeData() {
        return createWriter(Endian.BE).writeUByte(this.options.packetID)
            .writeInt(0)
            .writeShort(0)
            .writeInt(0)
            .writeByte(15)
            .writeByte(127)
            .writeByte(15)
            .writeInt(this.world.length)
            .writeBuffer(this.world)
            .toBuffer();
    }
}