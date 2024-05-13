import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
	auth0Id: {
		type: String,
		requerid: true,
	},
	email: {
		type: String,
		requerid: true,
	},
	name: {
		type: String,
	},
	addressLin1: {
		type: String,
	},
	city: {
		type: String,
	},
	country: {
		type: String,
	},
});

export default mongoose.model("User", userSchema);
