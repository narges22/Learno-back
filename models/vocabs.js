import mongoose, { Schema } from "mongoose";

export const vocabSchema = new Schema(
  {
    word: String,
    meaning: String,
    complexity: Number,
    academicSynonym: String,
    defaultlevel: Number,
    partOfSpeach: String,
    example: String,
  },
  { timestamps: true }
);

const Vocab = mongoose.model("Vocab", vocabSchema);
export default Vocab;
