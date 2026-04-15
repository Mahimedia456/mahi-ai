import { qdrant } from "./qdrant.js";
import { embedTexts } from "./embed.js";

export async function searchMemory({query, userId, projectId}){

  const vectors = await embedTexts([query]);

  const vector = vectors[0];

  const result = await qdrant.search("mahi_memory",{

    vector,
    limit:5,
    filter:{
      must:[
        {
          key:"userId",
          match:{ value:userId }
        }
      ]
    }

  });

  return result.map(r => r.payload.text);

}