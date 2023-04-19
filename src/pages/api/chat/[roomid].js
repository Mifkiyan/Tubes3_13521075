import connect from "../../../../database/conn";
import { getChat, createChat, deleteChat } from "../../../../controller/messages.controller";

export default async function handler(req, res) {
  connect().catch((err) => res.status(400).json({error: "DATABASE ERROR"}));
  
  switch (req.method) {
    case "GET":
      await getChat(req, res);
      break;

    case "POST":
      await createChat(req, res);
      break;

    case "DELETE":
      await deleteChat(req, res);
      break;
    
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(400).json({error: "BAD REQUEST [roomid]"});
      break;
  }
}