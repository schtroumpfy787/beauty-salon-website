const db = require('./pool');
const bcrypt = require('bcryptjs');
const config = require('../config');
const initDatabase = require('./init');

const servicesData = [
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Soins', value: 'sce', name: "Soin Coup d'éclat", price: 29.90, duration: 30, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Soins', value: 'shn', name: 'Soin Hydratant et Nourrissant', price: 39, duration: 45, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Soins', value: 'st', name: 'Soin Traitant', price: 59, duration: 90, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Soins', value: 'saa', name: 'Soin Anti-Age', price: 75, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Soins', value: 'ct', name: 'Cryothérapie', price: 39.90, duration: 60, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Massages', value: 'mk', name: 'Massage Kobido', price: 40, duration: 60, path: '/massages.html?target=mk' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Massages', value: 'mks', name: 'Massage Kobido Suprême', price: 54, duration: 80, path: '/massages.html?target=mks' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Massages', value: 'mbr', name: 'Massage Beauté du Regard', price: 40, duration: 60, path: '/massages.html?target=mbr' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Massages', value: 'mc', name: 'Massage Californien', price: 45, duration: 60, path: '/massages.html?target=mc' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Massages', value: 'gm', name: 'Gommage et Massage', price: 40, duration: 60, path: '/massages.html?target=gm' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'evl', name: 'Épilation des lèvres', price: 8.50, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'evm', name: 'Épilation du menton', price: 8.50, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'evj', name: 'Épilation des joues', price: 9, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'evc', name: 'Épilation du visage (Sourcils + Lèvres + Menton)', price: 21, duration: 45, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'esl', name: 'Création de la ligne des sourcils', price: 12, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ees', name: 'Épilation des sourcils', price: 9, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ec', name: 'Épilation du cou', price: 9, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ev', name: 'Épilation du ventre', price: 9, duration: 10, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ejc', name: 'Épilation des jambes complètes', price: 25, duration: 45, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'edj', name: 'Épilation des 1/2 jambes', price: 18, duration: 20, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'etqj', name: 'Épilation des 3/4 jambes', price: 22, duration: 25, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ej', name: 'Épilation des cuisses', price: 18, duration: 20, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'eme', name: 'Épilation du maillot échancré', price: 16, duration: 25, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'emsi', name: 'Épilation du maillot semi-intégral', price: 22, duration: 25, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'emi', name: 'Épilation du maillot intégral', price: 27, duration: 60, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ea', name: 'Épilation des aisselles', price: 11, duration: 15, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ebd', name: 'Épilation des 1/2 bras', price: 12, duration: 15, path: '/' },
  { img: 'https://placehold.co/400', alt: 'placeholder image', group: 'Épilations', value: 'ebc', name: 'Épilation des bras', price: 18, duration: 25, path: '/' },
];

const faqData = [
  { question: "Dois-je prendre rendez-vous avant de venir ?", answer: "Oui, l'Institut For You fonctionne exclusivement sur rendez-vous. Vous pouvez nous contacter par téléphone ou via le formulaire de contact du site.", display_order: 1 },
  { question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons les paiements en espèces, par carte bancaire et par chèque.", display_order: 2 },
  { question: "Proposez-vous des bons cadeaux ?", answer: "Oui ! Vous pouvez offrir un bon cadeau pour n'importe quelle prestation ou pour un montant de votre choix. Rendez-vous sur notre page Bon Cadeau pour plus d'informations.", display_order: 3 },
  { question: "L'institut est-il accessible aux personnes à mobilité réduite ?", answer: "Notre institut est de plain-pied et accessible aux personnes à mobilité réduite.", display_order: 4 },
  { question: "Quels produits utilisez-vous ?", answer: "Brigitte sélectionne rigoureusement ses produits chez des fabricants français reconnus pour leur qualité et leur respect de la peau.", display_order: 5 },
  { question: "Quelle est votre politique d'annulation ?", answer: "Nous vous demandons de nous prévenir au moins 24 heures à l'avance en cas d'annulation ou de report de rendez-vous.", display_order: 6 },
];

const siteContentData = [
  { key: 'salon_name', value: 'Institut For You' },
  { key: 'salon_address', value: '3 Faubourg Voltaire, 13150 Tarascon, France' },
  { key: 'salon_phone', value: '04 90 91 XX XX' },
  { key: 'owner_name', value: 'Brigitte' },
  { key: 'owner_bio', value: "Depuis 2015, Brigitte, esthéticienne diplômée, vous reçoit sur rendez-vous du Mardi au Samedi pour vous offrir diverses prestations esthétiques: épilations, massages, soins du corps et du visage." },
];

async function seed() {
  console.log('Initializing schema...');
  await initDatabase();

  console.log('Seeding services...');
  for (const s of servicesData) {
    await db.query(
      `INSERT INTO services (img, alt, "group", value, name, price, duration, path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (value) DO UPDATE SET
         img = EXCLUDED.img, alt = EXCLUDED.alt, "group" = EXCLUDED."group",
         name = EXCLUDED.name, price = EXCLUDED.price, duration = EXCLUDED.duration,
         path = EXCLUDED.path, updated_at = NOW()`,
      [s.img, s.alt, s.group, s.value, s.name, s.price, s.duration, s.path]
    );
  }

  console.log('Seeding FAQ...');
  for (const f of faqData) {
    await db.query(
      `INSERT INTO faq (question, answer, display_order)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [f.question, f.answer, f.display_order]
    );
  }

  console.log('Seeding site content...');
  for (const c of siteContentData) {
    await db.query(
      `INSERT INTO site_content (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [c.key, c.value]
    );
  }

  console.log('Creating admin user...');
  const passwordHash = await bcrypt.hash(config.adminInitialPassword, 12);
  await db.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO NOTHING`,
    ['admin', passwordHash]
  );

  console.log('Seed completed successfully.');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

module.exports = seed;
