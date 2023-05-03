import connect  from "../../../../database/conn";
import { getQnaID, updateQnaID, deleteQnaID } from "../../../../controller/qna.controller";

export default async function handler(req, res) {
  connect().catch((err) => res.status(400).json({error: "DATABASE ERROR"}));

  const { method } = req;
  switch(method) {
    case "GET":
      getQnaID(req, res);
      break;
    case "PUT":
      updateQnaID(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]); 
      res.status(405).json({error: "Method not allowed"});
      break;
  }
}