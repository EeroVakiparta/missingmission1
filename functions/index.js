const functions = require('firebase-functions');
const Filter = require('bad-words');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async (doc, ctx) => {

        const filter = new Filter();
        const {
            text,
            uid
        } = doc.data();
        var customFilter = new Filter({
            placeHolder: 'X'
        });
        customFilter.addWords('Eero', 'kokkikaksikko', 'työ',
            'nussi',
            'bylsiä',
            'haahka',
            'paska',
            'vittu',
            'hatullinen',
            'helvetisti',
            'hevonkuusi',
            'hevonpaska',
            'hevonperse',
            'hevonvittu',
            'hevonvitunperse',
            'hitosti',
            'hitto',
            'huorata',
            'hässiä',
            'kustu',
            'jutku',
            'jutsku',
            'jätkä',
            'kananpaska',
            'koiranpaska',
            'esterin',
            'perseestä',
            'kulli',
            'kullinluikaus',
            'kuppainen',
            'kusaista',
            'kuseksia',
            'kusettaa',
            'kusi',
            'kusipää',
            'kusta',
            'kyrpiintynyt',
            'kyrpiintyä',
            'kyrpiä',
            'kyrpä',
            'kyrpänaama',
            'kyrvitys',
            'lahtari',
            'lutka',
            'molo',
            'molopää',
            'mulkero',
            'mulkku',
            'mulkvisti',
            'muna',
            'munapää',
            'munaton',
            'mutakuono',
            'mutiainen',
            'naida',
            'nainti',
            'narttu',
            'neekeri',
            'nekru',
            'nuolla',
            'persettä',
            'nussia',
            'nussija',
            'nussinta',
            'paljaalla',
            'palli',
            'pallit',
            'paneskella',
            'panettaa',
            'panna',
            'pano',
            'pantava',
            'paska',
            'paskainen',
            'paskamainen',
            'paskanmarjat',
            'paskantaa',
            'paskapuhe',
            'paskapää',
            'paskattaa',
            'paskiainen',
            'paskoa',
            'pehko',
            'pentele',
            'perkele',
            'perkeleesti',
            'persaukinen',
            'perse',
            'perseennuolija',
            'perseet',
            'persereikä',
            'perseääliö',
            'persläpi',
            'perspano',
            'persvako',
            'pilkunnussija',
            'pillu',
            'pillut',
            'pipari',
            'piru',
            'pistää',
            'pyllyvako',
            'reikä',
            'reva',
            'ripsipiirakka',
            'runkata',
            'runkkari',
            'runkkaus',
            'runkku',
            'ryssä',
            'rättipää',
            'saatanasti',
            'suklaaosasto',
            'tavara',
            'toosa',
            'tuhkaluukku',
            'tumputtaa',
            'turpasauna',
            'tussu',
            'tussukka',
            'tussut',
            'vakipano',
            'viiksi',
            'vittu',
            'vittuilla',
            'vittuilu',
            'vittumainen',
            'vittuuntua',
            'vittuuntunut',
            'vitun',
            'vitusti',
            'vituttaa',
            'vitutus',
            'äpärä');

        if (customFilter.isProfane(text)) {
            console.log('Message contains profanity');
            let cleaned = customFilter.clean(text);
            let placeholderi = /([^ "]*\X[^ "]*)/g;
            let erkka = "Erkka";

            cleaned = cleaned.replace(placeholderi, erkka);
            console.log(cleaned.toString());
            await doc.ref.update({
                text: `${cleaned}`
            });

            //await db.collection('banned').doc(uid).set({});
        }
        /*  
       const userRef = db.collection('users').doc(uid)

        const userData = (await userRef.get()).data();

        if (userData.msgCount >= 7) {
            await db.collection('banned').doc(uid).set({});
        } else {
            await userRef.set({ msgCount: (userData.msgCount || 0) + 1 })
        } */

    });