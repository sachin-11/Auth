const mongoose = require("mongoose");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: false,
      default: 0,
    },

    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["verified", "pending", "deactivated"],
      default: "pending",
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: false,
    },
    fcm_token: {
      type: String,
      required: false,
      default: "",
    },
    device_type: {
      type: String,
      enum: ["android", "ios"],
      default: "android",
      required: false,
    },
    device_id: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

usersSchema.plugin(softDelete);

const Users = mongoose.model("User", usersSchema);

module.exports = Users;
