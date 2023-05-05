import Qna from "../models/qna.model.js";

export async function getQna() {
  try {
    const qna = await Qna.find({});
    return qna; 
  } catch (error) {
    res.status(400).json({error: "ERROR GETTING QNA"});
  }
}

export async function createQna(question, answer) {
  try {
    const qna = new Qna({
      userQuestion : question,
      botAnswer : answer
    })
    await qna.save();

    return "Pertanyaan [" + question + "] berhasil ditambahkan";
      
  } catch (error) {
    return "Pertanyaan [" + question + "] gagal ditambahkan";
  }
}

export async function deleteQna(question) {
  try {
    await Qna.findOneAndDelete(
      { userQuestion: question }
    );

    return "Pertanyaan [" + question + "] berhasil dihapus";
      
  } catch (error) {
    return "Tidak ada pertanyaan [" + question + "] di database";
  }
}

export async function updateQna(questionToAdd, answer) {
  try {
    const qna = await Qna.findOneAndUpdate(
      { userQuestion: questionToAdd }, 
      { $set: {botAnswer: answer} }
    );
    return "Pertanyaan [" + questionToAdd + "] berhasil diupdate dengan jawaban [" + answer + "]";
  } catch (error) {
    return "Pertanyaan [" + questionToAdd + "] gagal diupdate";
  }
}


export async function getQnaID (req,res) {
  try {
    const { qnaid } = req.query;
    if (qnaid) {
      const qna = await Qna.findById(qnaid);
      res.status(200).json(qna);
    }
    res.status(400).json({error: "NO QNA ID PROVIDED"});
  } catch (error) {
    res.status(400).json({error: "ERROR GETTING QNA ID"});
  }
}

export async function updateQnaID (req, res) {
  try {
    const { qnaid } = req.query;
    const updateData = req.body;

    if (updateData) {
      const qna = await Qna.findByIdAndUpdate(qnaid, updateData);
      res.status(200).json(qna);
    }
    res.status(400).json({error: "NO QNA ID PROVIDED"});

  } catch (error) {
    res.status(400).json({error: "ERROR UPDATING QNA"});
  }
}