// Imports
const { initializeFirebaseApp, restore } = require('firestore-export-import');
const serviceAccount = require('./serviceAccount.json');

// JSON To Firestore
const jsonToFirestore = () => {
    try {
        console.log('Initialzing Firebase');
        const firestore = initializeFirebaseApp(serviceAccount);

        console.log('Firebase Initialized');

        ['provincias', 'municipios', 'libros', 'categorias'].forEach(
            (item) => {
                restore(
                    firestore,
                    './mongojson/' + item + '.json',
                    {
                        autoParseDates: true,// use this one in stead of dates: [...]
                        geos: ['location', 'locations'],
                        refs: ['refKey']
                    }
                );
                console.log(`subido:${item} .....`);

            }
        );
    }
    catch (error) {
        console.log(error);
    }
};

jsonToFirestore();