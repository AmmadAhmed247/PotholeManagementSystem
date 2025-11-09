const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'mna', 'mpa'], required: true },
    createdAt: { type : Date, default : Date.now}
});

module.exports = mongoose.model('User', UserSchema);