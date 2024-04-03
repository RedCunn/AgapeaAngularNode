const { initializeFirebaseApp, restore } = require('firestore-export-import');
const serviceAccount = require('../serviceAccount.json');

const jsonToFirestore =  () => {
    try {
      console.log('Initialzing Firebase');
      const firestore = initializeFirebaseApp(serviceAccount);

      console.log('Firebase Initialized');

      ['libros', 'ofertas', 'temas'].forEach(
      //['provincias','municipios','libros','categorias'].forEach(
          (item) => {
              restore( 
                          firestore,
                          './' + item +'.json',
                          {
                              autoParseDates: true ,// use this one in stead of dates: [...]
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