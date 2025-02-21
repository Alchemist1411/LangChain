import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  threadId: { type: String, required: true, unique: true },
  messages: { type: Array, required: true },
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;