import Message from '../models/message.model.js';
import Room from '../models/room.model.js';
import { getAnswer } from '../src/algorithm/getAnswer.js';

export async function getChat(req, res) {
  try {
    const { roomid } = req.query;
    
    if (!roomid) {
      return res.status(400).json({error: "room id not found"});
    }

    const messages = await Message.find({ room : roomid }, {__v: 0, room: 0});

    if (!messages) {
      return res.status(400).json({error: "messages not found"});
    }

    return res.status(200).json ({success: true, data: messages})
  } catch (error) {
    res.status(400).json({error: "getChat error"});
  }
}

export async function createChat(req, res) {
  const { roomid } = req.query;
  const { question, answer, chosenOption }  = req.body;
  const rooms = await Room.findOne({ _id: roomid });

  const newAnswer = await getAnswer(question, chosenOption);
  if (!rooms) {
    return res.status(400).json({error: "room not found"});
  }

  const message = new Message({
    question,
    answer : newAnswer,
    room : roomid
  })

  await message.save();

  rooms.messages.push(message._id);

  await rooms.save();

  return res.status(200).json({success: true, data: message});
}

export async function deleteChat (req, res) {
  try {
    const { id } = req.query;

    await Message.findByIdAndDelete(id);
    return res.status(200).json({success: true, deleted: id});
  } catch (error) {
    return res.status(400).json({error})
  }
}