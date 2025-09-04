// js/services/firestoreService.js (VERSÃO CORRETA)

const db = firebase.firestore();

// --- Products ---
export const onProductsChange = (callback) => {
  return db.collection("products").orderBy("name").onSnapshot(callback);
};
export const addProduct = (product) => {
  return db.collection("products").add(product);
};
export const updateProduct = (id, product) => {
  return db.collection("products").doc(id).update(product);
};
export const deleteProduct = (id) => {
  return db.collection("products").doc(id).delete();
};

// --- Rentals ---
export const onRentalsChange = (callback) => {
  return db.collection("rentals").orderBy("date", "desc").onSnapshot(callback);
};
export const addRental = (rental) => {
  return db.collection("rentals").add({
    ...rental,
    payments: [], // Inicializa com um histórico de pagamentos vazio
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};
export const updateRental = (id, rental) => {
  return db.collection("rentals").doc(id).update(rental);
};
export const deleteRental = (id) => {
  return db.collection("rentals").doc(id).delete();
};
export const addPayment = (id, amount) => {
  const payment = {
    amount: parseFloat(amount),
    date: new Date(),
  };
  return db
    .collection("rentals")
    .doc(id)
    .update({
      payments: firebase.firestore.FieldValue.arrayUnion(payment),
    });
};
export const deletePayment = (id, payment) => {
  return db
    .collection("rentals")
    .doc(id)
    .update({
      payments: firebase.firestore.FieldValue.arrayRemove(payment),
    });
};
export const updateRentalPayment = (id, paidInstallments) => {
  return db.collection("rentals").doc(id).update({
    "paymentInfo.paidInstallments": paidInstallments,
  });
};
