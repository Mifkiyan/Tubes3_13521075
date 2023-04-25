import connect  from "../../../../database/conn";
import { getQna, createQna, deleteQna } from "../../../../controller/qna.controller";

export default async function handler(req, res) {
  connect().catch((err) => res.status(400).json({error: "DATABASE ERROR"}));


  switch (req.method) {
    case "GET":
      await getQna(req, res);
      break;
    case "POST":
      await createQna(req, res);
      break;
    // case "PUT":
    //   res.status(200).json({name: "PUT Request"});
    //   break;
    case "DELETE":
      await deleteQna(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]); 
      res.status(405).json({error: "Method not allowed"});
      break;
  }
}