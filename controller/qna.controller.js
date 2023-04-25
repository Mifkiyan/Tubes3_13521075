import Qna from "../models/qna.model.js";

export async function getQna(req, res) {
  try {
    const qna = await Qna.find({});

    if (!qna) {
      res.status(400).json({error: "QNA NOT FOUND"});
    }
    res.status(200).json(qna);
  } catch (error) {
    res.status(400).json({error: "ERROR GETTING QNA"});
  }
}

export async function createQna(req, res) {
  try {
    const { userQuestion, botAnswer } = req.body;

    if(!userQuestion && !botAnswer) {
      return res.status(400).json({error: "INVALID FORM QNA DATA"})
    }

    const qna = new Qna({
      userQuestion,
      botAnswer
    })

    await qna.save();

    return res.status(200).json({data: qna});
      
  } catch (error) {
    return res.status(400).json({error: "ERROR CREATING QNA"});
  }
}

export async function deleteQna(req, res) {
  try {
    const { id } = req.query;

    if(!id) {
      return res.status(400).json({error: "NO QNA ID PROVIDED"})
    }

    await Qna.findByIdAndDelete(id);

    return res.status(200).json({deleted: id});
      
  } catch (error) {
    return res.status(400).json({error: "ERROR DELETING QNA"});
  }
}