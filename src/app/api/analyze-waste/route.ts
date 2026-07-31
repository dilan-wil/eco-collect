// app/api/analyze-waste/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    
    // Remove the base64 header
    const base64Data = image.split(',')[1];
    
    // Convertir en Buffer puis en ArrayBuffer
    const buffer = Buffer.from(base64Data, 'base64');
    const arrayBuffer = new Uint8Array(buffer).buffer;
    
    const result = await hf.imageClassification({
      model: "google/vit-base-patch16-224",
      data: arrayBuffer,  // Utiliser ArrayBuffer directement
    });
    
    // Check if result contains waste-related labels
    const wasteKeywords = ['trash', 'waste', 'garbage', 'plastic', 'bottle', 'can', 'paper', 'cardboard'];
    const wasteDetections = result.filter(item => 
      wasteKeywords.some(keyword => 
        item.label.toLowerCase().includes(keyword)
      )
    );
    
    const hasWaste = wasteDetections.length > 0;
    const confidence = hasWaste ? Math.round(wasteDetections[0].score * 100) : 0;
    
    return NextResponse.json({
      hasWaste,
      confidence,
      objects: wasteDetections.map(d => d.label).slice(0, 3),
      decision: hasWaste ? 'Validé' : 'Non détecté',
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur d'analyse" },
      { status: 500 }
    );
  }
}