var ByteBuffer = require("../ByteBuffer.js");

var suite = {

    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },

    "construct/allocate": function(test) {
        var bb = new ByteBuffer();
        test.equal(bb.array.byteLength, ByteBuffer.DEFAULT_CAPACITY);
        bb = ByteBuffer.allocate();
        test.equal(bb.array.byteLength, ByteBuffer.DEFAULT_CAPACITY);
        test.done();
    },
    
    "wrap(ArrayBuffer)": function(test) {
        var buf = new ArrayBuffer(1);
        var bb = ByteBuffer.wrap(buf);
        test.strictEqual(bb.array, buf);
        test.equal(bb.offset, 0);
        test.equal(bb.length, 1);
        test.done();
    },
    
    "wrap(Uint8Array)": function(test) {
        var buf = new Uint8Array(1);
        var bb = ByteBuffer.wrap(buf);
        test.strictEqual(bb.array, buf.buffer);
        test.done();
    },
    
    "wrap(ByteBuffer)": function(test) {
        var bb2 = new ByteBuffer(1);
        var bb = ByteBuffer.wrap(bb2);
        test.strictEqual(bb.array, bb2.array);
        test.done();
    },

    "resize": function(test) {
        var bb = new ByteBuffer(1);
        bb.resize(2);
        test.equal(bb.array.byteLength, 2);
        test.equal(bb.toHex(), "|00 00");
        test.done();
    },
    
    "slice": function(test) {
        var bb = new ByteBuffer(3);
        bb.writeUint8(0x12).writeUint8(0x34).writeUint8(0x56);
        var bb2 = bb.slice(1,2);
        test.strictEqual(bb.array, bb2.array);
        test.equal(bb.offset, 3);
        test.equal(bb.length, 0);
        test.equal(bb2.offset, 1);
        test.equal(bb2.length, 2);
        test.done();
    },

    "sliceAndCompact": function(test) {
        var bb = new ByteBuffer(3);
        bb.writeUint8(0x12).writeUint8(0x34).writeUint8(0x56);
        var bb2 = bb.sliceAndCompact(1,2);
        test.notStrictEqual(bb, bb2);
        test.notStrictEqual(bb.array, bb2.array);
        test.equal(bb2.offset, 0);
        test.equal(bb2.length, 1);
        test.equal(bb2.toHex(), "<34>");
        test.done();
    },

    "ensureCapacity": function(test) {
        var bb = new ByteBuffer(5);
        test.equal(bb.array.byteLength, 5);
        bb.ensureCapacity(6);
        test.equal(bb.array.byteLength, 10);
        bb.ensureCapacity(21);
        test.equal(bb.array.byteLength, 21);
        test.done();
    },

    "flip": function(test) {
        var bb = new ByteBuffer(4);
        bb.writeUint32(0x12345678);
        test.equal(bb.offset, 4);
        test.equal(bb.length, 0);
        bb.flip();
        test.equal(bb.offset, 0);
        test.equal(bb.length, 4);
        test.done();
    },

    "reset": function(test) {
        var bb = new ByteBuffer(4);
        bb.writeUint32(0x12345678);
        bb.reset();
        test.equal(bb.offset, 0);
        test.equal(bb.length, 0);
        test.done();
    },


    "clone": function(test) {
        var bb = new ByteBuffer(1);
        var bb2 = bb.clone();
        test.strictEqual(bb.array, bb2.array);
        test.equal(bb.offset, bb2.offset);
        test.equal(bb.length, bb2.length);
        test.notStrictEqual(bb, bb2);
        test.done();
    },
    
    "copy": function(test) {
        var bb = new ByteBuffer(1);
        bb.writeUint8(0x12);
        var bb2 = bb.copy();
        test.notStrictEqual(bb, bb2);
        test.notStrictEqual(bb.array, bb2.array);
        test.equal(bb2.offset, bb.offset);
        test.equal(bb2.length, bb.length);
        test.done();
    },
    
    "compact": function(test) {
        var bb = new ByteBuffer(2);
        bb.writeUint8(0x12);
        var prevArray = bb.array;
        bb.compact();
        test.notStrictEqual(bb.array, prevArray);
        test.equal(bb.array.byteLength, 1);
        test.equal(bb.offset, 0);
        test.equal(bb.length, 1);
        test.done();
    },
    
    "destroy": function(test) {
        var bb = new ByteBuffer(1);
        bb.writeUint8(0x12);
        bb.destroy();
        test.strictEqual(bb.array, null);
        test.equal(bb.offset, 0);
        test.equal(bb.length, 0);
        test.equal(bb.toHex(), "DESTROYED");
        test.done();
    },
    
    "write/readInt8": function(test) {
        var bb = new ByteBuffer(1);
        bb.writeInt8(0xFF);
        bb.flip();
        test.equal(-1, bb.readInt8());
        test.done();
    },

    "write/readByte": function(test) {
        var bb = new ByteBuffer(1);
        test.strictEqual(bb.readInt8, bb.readByte);
        test.strictEqual(bb.writeInt8, bb.writeByte);
        test.done();
    },
    
    "write/readUint8": function(test) {
        var bb = new ByteBuffer(1);
        bb.writeUint8(0xFF);
        bb.flip();
        test.equal(0xFF, bb.readUint8());
        test.done();
    },
    
    "write/readInt16": function(test) {
        var bb = new ByteBuffer(2);
        bb.writeInt16(0xFFFF);
        bb.flip();
        test.equal(-1, bb.readInt16());
        test.done();
    },
    
    "write/readShort": function(test) {
        var bb = new ByteBuffer(1);
        test.strictEqual(bb.readInt16, bb.readShort);
        test.strictEqual(bb.writeInt16, bb.writeShort);
        test.done();
    },

    "write/readUint16": function(test) {
        var bb = new ByteBuffer(2);
        bb.writeUint16(0xFFFF);
        bb.flip();
        test.equal(0xFFFF, bb.readUint16());
        test.done();
    },
    
    "write/readInt32": function(test) {
        var bb = new ByteBuffer(4);
        bb.writeInt32(0xFFFFFFFF);
        bb.flip();
        test.equal(-1, bb.readInt32());
        test.done();
    },
    
    "write/readInt": function(test) {
        var bb = new ByteBuffer(1);
        test.strictEqual(bb.readInt32, bb.readInt);
        test.strictEqual(bb.writeInt32, bb.writeInt);
        test.done();
    },
    
    "write/readUint32": function(test) {
        var bb = new ByteBuffer(4);
        bb.writeUint32(0x12345678);
        bb.flip();
        test.equals(0x12345678, bb.readUint32());
        test.done();
    },
    
    "write/readFloat32": function(test) {
        var bb = new ByteBuffer(4);
        bb.writeFloat32(0.5);
        bb.flip();
        test.equals(0.5, bb.readFloat32()); // 0.5 remains 0.5 if Float32
        test.done();
    },
    
    "write/readFloat": function(test) {
        var bb = new ByteBuffer(1);
        test.strictEqual(bb.readFloat32, bb.readFloat);
        test.strictEqual(bb.writeFloat32, bb.writeFloat);
        test.done();
    },
    
    "write/readFloat64": function(test) {
        var bb = new ByteBuffer(8);
        bb.writeFloat64(0.1);
        bb.flip();
        test.equals(0.1, bb.readFloat64()); // would be 0.10000000149011612 if Float32
        test.done();
    },
    
    "write/readDouble": function(test) {
        var bb = new ByteBuffer(1);
        test.strictEqual(bb.readFloat64, bb.readDouble);
        test.strictEqual(bb.writeFloat64, bb.writeDouble);
        test.done();
    },
    
    "write/readLString": function(test) {
        var bb = new ByteBuffer(2);
        bb.writeLString("a");
        test.equal(bb.offset, 2);
        test.equals(bb.length, 0);
        bb.flip();
        test.equal(bb.toHex(), "<01 61>00 00 00 00 00");
        test.equal("a", bb.readLString());
        test.done();
    },
    
    "write/readCString": function(test) {
        var bb = new ByteBuffer(2);
        bb.writeCString("a");
        test.equal(bb.offset, 2);
        test.equal(bb.length, 0);
        bb.flip();
        test.equal(bb.toHex(), "<61 00>00 00 00 00");
        test.equal("a", bb.readCString());
        test.done();
    },
    
    "write/readJSON": function(test) {
        var bb = new ByteBuffer();
        var data = {"x":1};
        bb.writeJSON(data);
        bb.flip();
        test.deepEqual(data, bb.readJSON());
        test.done();
    },
    
    "toHex": function(test) {
        var bb = new ByteBuffer(3);
        bb.writeUint16(0x1234);
        test.equal(bb.toHex(), ">12 34<00");
        test.done();
    },
    
    "toString": function(test) {
        var bb = new ByteBuffer(3);
        bb.writeUint16(0x1234);
        test.equal(bb.toString(), "ByteBuffer(offset=2,length=0,capacity=3)");
        test.done();
    },
    
    "toArrayBuffer": function(test) {
        var bb = new ByteBuffer(3);
        bb.writeUint16(0x1234);
        var buf = bb.toArrayBuffer();
        test.equal(buf.byteLength, 2);
        test.equal(buf[0], 0x12);
        test.equal(buf[1], 0x34);
        test.equal(bb.offset, 2);
        test.equal(bb.length, 0);
        test.equal(bb.array.byteLength, 3);
        test.done();
    }
    
    // TODO encode/decodeUTFChar
};

module.exports = suite;