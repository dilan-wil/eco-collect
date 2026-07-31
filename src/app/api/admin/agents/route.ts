// app/api/admin/agents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendWelcomeEmail } from "@/lib/mailer";
import { z } from "zod";

// Schema de validation
const AgentSchema = z.object({
  email: z.string().email("Email invalide"),
  nom_complet: z.string().min(2, "Nom complet requis"),
  matricule: z.string().min(2),
  id_organisation: z.string().min(2),
  phone: z.string().optional(),
  zone_intervention: z.string().optional(),
  vehicule_id: z.string().uuid().optional(),
});

function generatePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
    const validated = AgentSchema.parse(body);

    const {
      email,
      nom_complet,
      phone,
      zone_intervention,
      matricule,
      id_organisation,
      vehicule_id,
    } = validated;

    // Générer un mot de passe
    const generatedPassword = generatePassword(12);

    // 1. Créer l'utilisateur auth avec métadonnées
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: {
          nom_complet,
          phone: phone || null,
          zone_intervention: zone_intervention || null,
          vehicule_id: vehicule_id || null,
          role: "AGENT",
          created_by: "admin",
          created_at: new Date().toISOString(),
        },
        app_metadata: {
          role: "AGENT",
          provider: "email",
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: `Erreur création auth: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Créer l'utilisateur dans la table utilisateurs
    const { error: userError } = await supabaseAdmin
      .from("utilisateurs")
      .insert({
        id: userId,
        email,
        nom_complet,
        phone,
        role: "AGENT",
      });

    if (userError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: `Erreur création utilisateur: ${userError.message}` },
        { status: 400 }
      );
    }

    // 3. Créer l'agent
    const { data: agent, error: agentError } = await supabaseAdmin
      .from("agents")
      .insert({
        id: userId,
        zone_intervention,
        nom_complet,
        email,
        phone,
        matricule,
        id_organisation,
        vehicule_id,
        date_creation: new Date().toISOString(),
        statut: "disponible",
      })
      .select()
      .single();

    if (agentError) {
      await supabaseAdmin.from("utilisateurs").delete().eq("id", userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: `Erreur création agent: ${agentError.message}` },
        { status: 400 }
      );
    }

    // 4. Envoyer l'email de bienvenue
    try {
      await sendWelcomeEmail({
        email,
        nom_complet,
        password: generatedPassword,
        matricule,
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      return NextResponse.json({
        success: true,
        message: "Agent créé mais l'email n'a pas pu être envoyé.",
        agent,
        warning: "Email non envoyé",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Agent créé avec succès. Un email a été envoyé avec ses identifiants.",
      agent,
      user: {
        id: userId,
        email,
        metadata: authData.user.user_metadata,
      },
    });

  } catch (err) {
    console.error("Erreur création agent:", err);

    // ✅ Correction : Gestion correcte de l'erreur Zod
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Erreur de validation", 
          details: err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}