// db.enablePersistence()
//   .catch(err => {
//     if (err.code == 'failed-precondition') {
//       // Tener cuidado, no abrir muchas pestañas. Modo offline solo funciona con un solo tab
//       console.error('persistence failed');
//     } else if (err.code === 'unimplemented') {
//       // Tu navegador no soporta este tipo de tecnologia
//       console.error('persistence is not available');
//     }
//   });

const createPosts = ({ description, title, image, timestamp }) => {
  let UNIX;
  if (timestamp) {
    UNIX = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).getTime();
    UNIX = dayjs(UNIX).fromNow(); // Calculo de tiempo de la publicacion (momentjs)
  }
  // Container
  const cardText = document.createElement('div');
  cardText.className = 'card-posts mdl-card mdl-shadow--2dp select-none';

  // title
  const cardTitleContainer = document.createElement('div');
  cardTitleContainer.className = 'mdl-card__title select-none';
  const cardH3 = document.createElement('h3');
  cardH3.className = 'mdl-card__title-text fs8';
  cardH3.appendChild(document.createTextNode(title));
  cardTitleContainer.appendChild(cardH3);
  // Body
  const cardBodyContainer = document.createElement('div');
  cardBodyContainer.className = 'mdl-card__supporting-text';
  cardBodyContainer.appendChild(document.createTextNode(description));

  // Date
  const cardDateContainer = document.createElement('div');
  cardDateContainer.className = 'mdl-card__actions mdl-card--border pa-0';
  const enlace = document.createElement('div');
  enlace.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect';
  enlace.appendChild(document.createTextNode(UNIX ? UNIX : ''));
  cardDateContainer.appendChild(enlace);
  
  // Share
  const cardShareContainer = document.createElement('div');
  cardShareContainer.className = 'mdl-card__menu';
  
  const button = document.createElement('div');
  button.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect"';
  
  const icon = document.createElement('i');
  icon.className = 'material-icons mdl-color-text--orange';
  icon.appendChild(document.createTextNode('share'));
  button.appendChild(icon);
  cardShareContainer.appendChild(button);

  
  cardText.appendChild(cardTitleContainer);
  cardText.appendChild(cardBodyContainer);
  cardText.appendChild(cardDateContainer);
  cardText.appendChild(cardShareContainer);

  componentHandler.upgradeElement(cardText);
  MAIN.appendChild(cardText);
};

const getOfflineData = () => {
  console.log('offline');
  const dbPost = new PouchDB('posts');
  dbPost.allDocs(({ include_docs: true }))
    .then((docs) => {
      docs.rows.forEach(registro => {
        const doc = registro.doc;
        createPosts(doc);
      })
    })
}

if (window.location.href.includes('post.html')) {
  const urlRD = 'https://postme-5ceb1-default-rtdb.firebaseio.com/postme-app.json';
  console.log(urlRD, 'url');
  logJSONData(urlRD);
  // db.on('postme-app')
  /*db.collection('posts').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        createPosts(data);
        closePostModal();
        document.forms[0].reset();

      }
      if (change.type === 'removed') {
        const data = change.doc.data(); 
        createPosts(data);
        closePostModal();
        document.forms[0].reset();
      }
    });
  })*/
}
if (window.location.href.includes('pending.html')) {
  //const urlRD = 'https://postme-5ceb1-default-rtdb.firebaseio.com/postme-app.json';

  const dbPost = new PouchDB('posts');
  dbPost.changes({
  since: 'now',
 live: true
 }).on('change',getOfflineData);

 getOfflineData(dbPost);
  
  // logJSONData(urlRD);
  // db.on('postme-app')
  /*db.collection('posts').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        createPosts(data);
        closePostModal();
        document.forms[0].reset();

      }
      if (change.type === 'removed') {
        const data = change.doc.data(); 
        createPosts(data);
        closePostModal();
        document.forms[0].reset();
      }
    });
  })*/
}

async function logJSONData(url) {
  const response = await fetch(url, {
    method: 'GET'
  });
  const jsonData = await response.json();
  console.log(jsonData);
  const transformData = Object.values(jsonData);
  console.log(transformData, 'values');
  transformData?.map((item) => createPosts(item))
  // createPosts(data);
  closePostModal();
  document.forms[0].reset();
}