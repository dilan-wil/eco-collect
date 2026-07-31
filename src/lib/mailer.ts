// lib/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({
  email,
  nom_complet,
  password,
  matricule,
}: {
  email: string;
  nom_complet: string;
  password: string;
  matricule: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur la plateforme</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          background: #f8fafc;
          padding: 30px 20px;
          border: 1px solid #e2e8f0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .credentials {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .credential-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .credential-item:last-child {
          border-bottom: none;
        }
        .credential-label {
          font-weight: 600;
          color: #64748b;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #0f172a;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 20px;
        }
        .button:hover {
          background: #1d4ed8;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #94a3b8;
        }
        .important {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 14px;
        }
        .divider {
          height: 1px;
          background: #e2e8f0;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 Bienvenue sur la plateforme</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">Votre compte a été créé avec succès</p>
      </div>
      
      <div class="content">
        <p>Bonjour <strong>${nom_complet}</strong>,</p>
        <p>Nous avons le plaisir de vous informer que votre compte a été créé sur la plateforme de gestion des signalements.</p>
        
        <div class="important">
          ⚠️ <strong>Important :</strong> Veuillez changer votre mot de passe lors de votre première connexion.
        </div>

        <h3 style="margin-bottom: 10px;">🔑 Vos identifiants de connexion</h3>
        <div class="credentials">
          <div class="credential-item">
            <span class="credential-label">📧 Email</span>
            <span class="credential-value">${email}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">🔐 Mot de passe</span>
            <span class="credential-value">${password}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">🆔 Matricule</span>
            <span class="credential-value">${matricule}</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login" class="button">
            Se connecter
          </a>
        </div>

        <div class="divider"></div>

        <h4 style="margin-bottom: 8px;">ℹ️ Informations supplémentaires</h4>
        <ul style="color: #64748b; font-size: 14px; padding-left: 20px;">
          <li>Vous pouvez accéder à votre espace personnel à tout moment</li>
          <li>En cas de problème, contactez le support</li>
          <li>Conservez ces identifiants en lieu sûr</li>
        </ul>

        <div class="divider"></div>

        <p style="font-size: 14px; color: #64748b;">
          Cordialement,<br>
          <strong>L'équipe de gestion</strong>
        </p>
      </div>

      <div class="footer">
        <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
        <p>&copy; ${new Date().getFullYear()} Plateforme de Gestion - Tous droits réservés</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Bienvenue sur la plateforme ${nom_complet},

    Vos identifiants de connexion :

    Email : ${email}
    Mot de passe : ${password}
    Matricule : ${matricule}

    Connectez-vous ici : ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login

    Important : Veuillez changer votre mot de passe lors de votre première connexion.

    Cordialement,
    L'équipe de gestion
  `;

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      '"Plateforme de Gestion" <noreply@plateforme.com>',
    to: email,
    subject: "🚀 Bienvenue - Vos identifiants de connexion",
    text,
    html,
  });
};
