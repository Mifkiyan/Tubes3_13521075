import connect from "../../../database/conn";

export default function handler(req, res) {
  connect().catch((err) => res.status(400).json({error: "DATABASE ERROR"}));
  res.status(200).json({ name: 'John Doe' });
}