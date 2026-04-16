export const search_params = [
    {
        query: ['contact', 'rendez-vous', 'coordonnées'],
        path: '/contact.html',
        sentence: "Contacter l'institut",
        redirect: 'null'
    },
    {
        query: ['accueil', 'home'],
        path: '/home.html',
        sentence: "Page d'accueil",
        redirect: 'null'
    },
    {
        query: ['prestations', 'populaires', 'top', 'meilleur', 'favorite'],
        path: '/home.html?target=features',
        sentence: "Prestations populaires",
        redirect: 'features'
    },
    {
        query: ["bénéfices", 'bienfait', 'intérêt', 'privilège'],
        path: '/home.html?target=benefits',
        sentence: "Raisons de choisir Institut For You",
        redirect: 'benefits'
    },
    {
        query: ['avis', 'commentaires', 'google', 'recommendations'],
        path: '/home.html?target=reviews',
        sentence: "Avis de clientes",
        redirect: 'reviews'
    },
    {
        query: ['à propos', 'propriétaire', 'brigitte', 'esthéticienne'],
        path: '/about.html?target=owner',
        sentence: "Rencontrer la propriétaire et l'estéticienne",
        redirect: 'owner'
    },
    {
        query: ['photos', 'images', 'institut', 'salle', 'gallerie'],
        path: '/about.html?target=gallery',
        sentence: "Gallerie photo de l'institut",
        redirect: 'gallery'
    },
    {
        query: ['questions', 'fréquentes', 'pourquoi', 'comment'],
        path: '/about.html?target=faq',
        sentence: "Questions fréquemment posées",
        redirect: 'faq'
    },
    {
        query: ['massages', 'gommage', 'relaxation'],
        path: '/massages.html',
        sentence: "Découvrir les massages",
        redirect: 'null'
    },
    {
        query: ['massage', 'facial', 'kobido', 'jeunesse', 'anti-age', 'jeunesse'],
        path: '/massages.html?target=mk',
        sentence: "Massage facial Kobdio",
        redirect: 'mk'
    },
    {
        query: ['massage', 'facial', 'kobido', 'jeunesse', 'anti-age', 'suprême', 'gommage', 'jeunesse'],
        path: '/massages.html?target=mks',
        sentence: "Massage facial Kobido Suprême",
        redirect: 'mks'
    }, 
    {
        query: ['massage', 'facial', 'beauté', 'regard', 'yeux', 'lifting', 'anti-age', 'jeunesse'],
        path: '/massages.html?target=mbr',
        sentence: "Massage facial beauté du regard",
        redirect: 'mbr'
    }, 
    {
        query: ['massage', 'corps', 'californien', 'détente', 'relaxation'],
        path: '/massages.html?target=mc',
        sentence: "Massage du corps californien",
        redirect: 'mc'
    },
    {
        query: ['gommage', 'massage', 'corps', 'exfolier'],
        path: '/massages.html?target=gm',
        sentence: "Gommage et massage du corps",
        redirect: 'gm'
    },
    {
        query: ['cadeau', 'bon', 'carte', 'offrir', 'anniversaire'],
        path: '/gift.html',
        sentence: "Acheter un bon cadeau",
        redirect: 'null'
    }
]