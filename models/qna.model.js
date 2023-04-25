import { Schema, model, models } from 'mongoose';

const QnaSchema = new Schema({
  userQuestion: String,
  botAnswer : String
})

export default models.Qna || model('Qna', QnaSchema);