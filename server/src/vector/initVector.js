import { qdrant } from "./qdrant.js";

export async function initVectorCollection(){

  try{

    await qdrant.createCollection("mahi_memory",{
      vectors:{
        size:384,
        distance:"Cosine"
      }
    })

    console.log("Vector collection ready")

  }catch(e){

    console.log("Vector collection exists")

  }

}