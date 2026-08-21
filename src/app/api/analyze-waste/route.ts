// app/api/analyze-waste/route.ts
import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    // Nettoyer l'image base64
    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    // Créer un blob avec le bon type MIME
    const blob = new Blob([buffer], { type: "image/jpeg" });

    // Analyser avec Hugging Face
    const result = await hf.imageClassification({
      model: "google/vit-base-patch16-224",
      data: blob,
    });

    // Filtrer les résultats
    const wasteKeywords = [
      // General waste
      "trash",
      "waste",
      "garbage",
      "litter",
      "rubbish",
      "refuse",
      "debris",
      "junk",

      // Plastic
      "plastic",
      "plastic bag",
      "bag",
      "shopping bag",
      "bottle",
      "water bottle",
      "soda bottle",
      "detergent bottle",
      "container",
      "packaging",
      "wrapper",
      "food wrapper",
      "film",
      "polyethylene",
      "cup",
      "plastic cup",
      "straw",
      "cap",
      "lid",
      "bucket",
      "tub",

      // Paper
      "paper",
      "cardboard",
      "carton",
      "box",
      "newspaper",
      "magazine",
      "receipt",
      "flyer",
      "poster",
      "book",
      "notebook",
      "envelope",

      // Metal
      "can",
      "tin",
      "aluminum",
      "aluminium",
      "steel",
      "foil",
      "metal",
      "beverage can",
      "soda can",
      "energy drink can",

      // Glass
      "glass",
      "glass bottle",
      "jar",
      "wine bottle",
      "beer bottle",

      // Food waste
      "banana",
      "banana peel",
      "apple",
      "apple core",
      "orange",
      "fruit",
      "food",
      "bread",
      "leftovers",
      "organic",
      "compost",

      // Cigarettes
      "cigarette",
      "cigarette butt",
      "butt",
      "ash",
      "ashtray",

      // Common litter
      "napkin",
      "tissue",
      "mask",
      "glove",
      "cloth",
      "fabric",
      "shoe",
      "tire",
      "tyre",
      "rope",
      "wire",
      "cup",
      "plate",
      "fork",
      "spoon",
    ];
    const wasteDetections = result.filter((item) => {
      const label = item.label.toLowerCase().replace(/[-_]/g, " ");
      return wasteKeywords.some((keyword) => label.includes(keyword));
    });

    // Si pas de déchet détecté, prendre le premier résultat
    const hasWaste = wasteDetections.length > 0;
    const confidence = hasWaste
      ? Math.round(wasteDetections[0].score * 100)
      : 50;

    return NextResponse.json({
      hasWaste,
      confidence,
      objects:
        wasteDetections.length > 0
          ? wasteDetections.map((d) => d.label).slice(0, 3)
          : ["Aucun déchet détecté"],
      decision: hasWaste ? "Validé" : "Non détecté",
    });
  } catch (error: any) {
    console.error("Erreur:", error.message);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 },
    );
  }
}
