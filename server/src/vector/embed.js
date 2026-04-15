import axios from "axios";
import { env } from "../config/env.js";

export async function embedTexts(texts){

  const res = await axios.post(
    `${env.pythonIngestUrl}/embed`,
    { texts }
  );

  return res.data.vectors;
}