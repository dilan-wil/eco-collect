// app/api/analyze-waste/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    
    // Nettoyer l'image base64
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Créer un blob avec le bon type MIME
    const blob = new Blob([buffer], { type: 'image/jpeg' });

    // Analyser avec Hugging Face
    const result = await hf.imageClassification({
      model: "google/vit-base-patch16-224",
      data: blob,
    });

    // Filtrer les résultats
    const wasteKeywords = ['trash', 'waste', 'garbage', 'plastic', 'bottle', 'can', 'paper', 'cardboard', 'litter'];
    const wasteDetections = result.filter(item => 
      wasteKeywords.some(keyword => 
        item.label.toLowerCase().includes(keyword)
      )
    );

    // Si pas de déchet détecté, prendre le premier résultat
    const hasWaste = wasteDetections.length > 0;
    const confidence = hasWaste ? Math.round(wasteDetections[0].score * 100) : 50;

    return NextResponse.json({
      hasWaste,
      confidence,
      objects: wasteDetections.length > 0 
        ? wasteDetections.map(d => d.label).slice(0, 3)
        : ["Aucun déchet détecté"],
      decision: hasWaste ? 'Validé' : 'Non détecté',
    });

  } catch (error: any) {
    console.error("Erreur:", error.message);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}