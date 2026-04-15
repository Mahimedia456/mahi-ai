import { qdrant } from "./qdrant.js";
import { embedTexts } from "./embed.js";
import { randomUUID } from "crypto";

export async function storeMemory({text, userId, projectId}){

  const vectors = await embedTexts([text]);

  const vector = vectors[0];

  await qdrant.upsert("mahi_memory",{

    points:[
      {
        id: randomUUID(),
        vector,
        payload:{
          text,
          userId,
          projectId
        }
      }
    ]

  });

}