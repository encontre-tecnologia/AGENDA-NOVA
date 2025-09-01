// js/services/firestoreService.js (VERSÃO ATUALIZADA)

const db = firebase.firestore();

// --- Products ---
// Não precisa mais do UID, acessa a coleção principal "products"
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
// Não precisa mais do UID, acessa a coleção principal "rentals"
export const onRentalsChange = (callback) => {
  return db.collection("rentals").orderBy("date", "desc").onSnapshot(callback);
};
export const addRental = (rental) => {
  return db.collection("rentals").add({
    ...rental,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};
export const updateRental = (id, rental) => {
  return db.collection("rentals").doc(id).update(rental);
};
export const deleteRental = (id) => {
  return db.collection("rentals").doc(id).delete();
};
export const updateRentalPayment = (id, paidInstallments) => {
  return db.collection("rentals").doc(id).update({
    "paymentInfo.paidInstallments": paidInstallments,
  });
};
