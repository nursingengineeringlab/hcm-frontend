// source: ecg.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.ecg.ECGPacket', null, global);
goog.exportSymbol('proto.ecg.ECGPacket.CommandType', null, global);
goog.exportSymbol('proto.ecg.ECGPacket.DataType', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ecg.ECGPacket = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ecg.ECGPacket, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ecg.ECGPacket.displayName = 'proto.ecg.ECGPacket';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ecg.ECGPacket.prototype.toObject = function(opt_includeInstance) {
  return proto.ecg.ECGPacket.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ecg.ECGPacket} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ecg.ECGPacket.toObject = function(includeInstance, msg) {
  var f, obj = {
    command: jspb.Message.getFieldWithDefault(msg, 1, 0),
    deviceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    sequenceId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    value: jspb.Message.getFieldWithDefault(msg, 4, 0),
    battery: jspb.Message.getFieldWithDefault(msg, 5, 0),
    active: jspb.Message.getBooleanFieldWithDefault(msg, 6, false),
    time: jspb.Message.getFieldWithDefault(msg, 7, 0),
    dataType: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ecg.ECGPacket}
 */
proto.ecg.ECGPacket.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ecg.ECGPacket;
  return proto.ecg.ECGPacket.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ecg.ECGPacket} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ecg.ECGPacket}
 */
proto.ecg.ECGPacket.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.ecg.ECGPacket.CommandType} */ (reader.readEnum());
      msg.setCommand(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeviceId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSequenceId(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setValue(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBattery(value);
      break;
    case 6:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setActive(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTime(value);
      break;
    case 8:
      var value = /** @type {!proto.ecg.ECGPacket.DataType} */ (reader.readEnum());
      msg.setDataType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ecg.ECGPacket.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ecg.ECGPacket.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ecg.ECGPacket} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ecg.ECGPacket.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCommand();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getDeviceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSequenceId();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getValue();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getBattery();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = message.getActive();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
  f = message.getTime();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
  f = message.getDataType();
  if (f !== 0.0) {
    writer.writeEnum(
      8,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.ecg.ECGPacket.CommandType = {
  NEW: 0,
  UPDATE: 1,
  CLOSE: 2
};

/**
 * @enum {number}
 */
proto.ecg.ECGPacket.DataType = {
  RRI: 0,
  TEMP: 1,
  SPO2: 2
};

/**
 * optional CommandType command = 1;
 * @return {!proto.ecg.ECGPacket.CommandType}
 */
proto.ecg.ECGPacket.prototype.getCommand = function() {
  return /** @type {!proto.ecg.ECGPacket.CommandType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.ecg.ECGPacket.CommandType} value */
proto.ecg.ECGPacket.prototype.setCommand = function(value) {
  jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string device_id = 2;
 * @return {string}
 */
proto.ecg.ECGPacket.prototype.getDeviceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.ecg.ECGPacket.prototype.setDeviceId = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int32 sequence_id = 3;
 * @return {number}
 */
proto.ecg.ECGPacket.prototype.getSequenceId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.ecg.ECGPacket.prototype.setSequenceId = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional int32 value = 4;
 * @return {number}
 */
proto.ecg.ECGPacket.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.ecg.ECGPacket.prototype.setValue = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional uint32 battery = 5;
 * @return {number}
 */
proto.ecg.ECGPacket.prototype.getBattery = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.ecg.ECGPacket.prototype.setBattery = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional bool active = 6;
 * @return {boolean}
 */
proto.ecg.ECGPacket.prototype.getActive = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
};


/** @param {boolean} value */
proto.ecg.ECGPacket.prototype.setActive = function(value) {
  jspb.Message.setProto3BooleanField(this, 6, value);
};


/**
 * optional uint64 time = 7;
 * @return {number}
 */
proto.ecg.ECGPacket.prototype.getTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {number} value */
proto.ecg.ECGPacket.prototype.setTime = function(value) {
  jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional DataType data_type = 8;
 * @return {!proto.ecg.ECGPacket.DataType}
 */
proto.ecg.ECGPacket.prototype.getDataType = function() {
  return /** @type {!proto.ecg.ECGPacket.DataType} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/** @param {!proto.ecg.ECGPacket.DataType} value */
proto.ecg.ECGPacket.prototype.setDataType = function(value) {
  jspb.Message.setProto3EnumField(this, 8, value);
};


goog.object.extend(exports, proto.ecg);
