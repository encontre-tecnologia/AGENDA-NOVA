// Gerencia a autenticação com o Firebase.
const auth = firebase.auth();

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
};

export const signOut = () => {
  return auth.signOut();
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
