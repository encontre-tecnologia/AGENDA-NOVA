// Cole aqui a sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbFutM7D1tONcAPZZlh3CDLJg8foIchHY",
  authDomain: "agenda-5ed03.firebaseapp.com",
  projectId: "agenda-5ed03",
  storageBucket: "agenda-5ed03.firebasestorage.app",
  messagingSenderId: "831246777436",
  appId: "1:831246777436:web:244956e676f0a092a2ba99",
  measurementId: "G-BZF42KFVN1",
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Cria uma referência global para o serviço do Firestore
const db = firebase.firestore();
