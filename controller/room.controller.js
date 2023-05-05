import Room from "../models/room.model.js";

export async function getAllRooms(req, res) {
    try {
        const rooms = await Room.find({})
        return res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        return res.status(400).json({ error: "DATABASE ERROR" });
    }
}

export async function createRoom(req, res) {
    try {
        const currentDate = new Date();
        const options = { timeZone: 'Asia/Jakarta', hour12: false };
        const dateTimeString = currentDate.toLocaleString('en-US', options);

        const len = await (await Room.find({})).length;
        const defaultRoom = {
            name: `${dateTimeString}`,
            messages: []
        }

        const chat = await Room.create(defaultRoom);
        return res.status(200).json({ success: true, data: chat });

    } catch (error) {
        return res.status(400).json({ error: "DATABASE ERROR roomcontroller" });
    }
}

export async function getRoom(req, res) {
    try {
        const { id } = req.query;
        const room = await Room.findById(id).populate("messages");

        if (!id) {
            return res.status(400).json({ error: "NO ID PROVIDED" });
        }

        if (!room) {
            return res.status(400).json({ error: "ROOM NOT FOUND" });
        }

        return res.status(200).json({ success: true, data: room });
    } catch (error) {
        return res.status(400).json({ error: "DATABASE ERROR" });
    }
}

export async function deleteRoom(req, res) {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "NO ID PROVIDED" });
        }

        await Room.findByIdAndDelete(id);
        return res.status(200).json({ success: true, deleted: id });
    } catch (error) {
        return res.status(400).json({ error })
    }
}