// Este arquivo centraliza a seleção de todos os elementos do DOM.
export const elements = {
  // Auth Elements
  loginContainer: document.getElementById("loginContainer"),
  appContainer: document.getElementById("appContainer"),
  googleLoginBtn: document.getElementById("googleLoginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  userName: document.getElementById("userName"),
  authContainer: document.getElementById("authContainer"),
  loadingOverlay: document.getElementById("loadingOverlay"),

  // Product Form Elements
  productForm: document.getElementById("productForm"),
  productNameInput: document.getElementById("productName"),
  productQuantityInput: document.getElementById("productQuantity"),
  productPriceInput: document.getElementById("productPrice"),
  addProductBtn: document.getElementById("addProductBtn"),
  productList: document.getElementById("productList"),

  // Expense Form Elements
  expenseForm: document.getElementById("expenseForm"),
  expenseDescriptionInput: document.getElementById("expenseDescription"),
  expenseAmountInput: document.getElementById("expenseAmount"),
  expenseList: document.getElementById("expenseList"),

  // Rental Form Elements
  rentalForm: document.getElementById("rentalForm"),
  clientNameInput: document.getElementById("clientName"),
  rentalAddressInput: document.getElementById("rentalAddress"),
  rentalDateInput: document.getElementById("rentalDate"),
  returnDateInput: document.getElementById("returnDate"),
  rentalInstallmentsInput: document.getElementById("rentalInstallments"),
  rentalDiscountInput: document.getElementById("rentalDiscount"),
  rentalMachineFeeInput: document.getElementById("rentalMachineFee"),
  selectedItemsContainer: document.getElementById("selectedItemsContainer"),
  noItemsSelected: document.getElementById("noItemsSelected"),
  productSelectionContainer: document.getElementById(
    "productSelectionContainer"
  ),
  submitRentalBtn: document.getElementById("submitRentalBtn"),
  rentalFormSummary: document.getElementById("rentalFormSummary"),

  // Rental History Elements
  rentalSearchInput: document.getElementById("rentalSearchInput"),
  rentalHistoryList: document.getElementById("rentalHistoryList"),
  totalRevenueValue: document.getElementById("totalRevenueValue"),
  totalReceivableValue: document.getElementById("totalReceivableValue"),
  totalExpensesValue: document.getElementById("totalExpensesValue"),
  netProfitValue: document.getElementById("netProfitValue"),

  // Generic Modal Elements
  modal: document.getElementById("modal"),
  modalContent: document.getElementById("modalContent"),
  modalFooter: document.getElementById("modalFooter"),
  closeModalBtn: document.getElementById("closeModalBtn"),

  // Payment Modal Elements
  paymentModal: document.getElementById("paymentModal"),
  paymentForm: document.getElementById("paymentForm"),
  rentalIdForPaymentInput: document.getElementById("rentalIdForPayment"),
  paymentAmountInput: document.getElementById("paymentAmount"),
  cancelPaymentBtn: document.getElementById("cancelPaymentBtn"),

  // Edit Product Modal Elements
  editProductModal: document.getElementById("editProductModal"),
  editProductForm: document.getElementById("editProductForm"),
  editProductIdInput: document.getElementById("editProductId"),
  editProductNameInput: document.getElementById("editProductName"),
  editProductQuantityInput: document.getElementById("editProductQuantity"),
  editProductPriceInput: document.getElementById("editProductPrice"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),

  // Help Modal Elements
  helpModal: document.getElementById("helpModal"),
  showHelpBtn: document.getElementById("showHelpBtn"),
  closeHelpBtn: document.getElementById("closeHelpBtn"),

  // Edit Rental Modal Elements
  editRentalModal: document.getElementById("editRentalModal"),
  editRentalForm: document.getElementById("editRentalForm"),
  editRentalIdInput: document.getElementById("editRentalId"),
  editClientNameInput: document.getElementById("editClientName"),
  editRentalAddressInput: document.getElementById("editRentalAddress"),
  editRentalDateInput: document.getElementById("editRentalDate"),
  editReturnDateInput: document.getElementById("editReturnDate"),
  editRentalInstallmentsInput: document.getElementById(
    "editRentalInstallments"
  ),
  editRentalDiscountInput: document.getElementById("editRentalDiscount"),
  editRentalMachineFeeInput: document.getElementById("editRentalMachineFee"),
  editSelectedItemsContainer: document.getElementById(
    "editSelectedItemsContainer"
  ),
  editProductSelectionContainer: document.getElementById(
    "editProductSelectionContainer"
  ),
  cancelEditRentalBtn: document.getElementById("cancelEditRentalBtn"),
  saveRentalBtn: document.getElementById("saveRentalBtn"),
  toggleEditProductSelectionBtn: document.getElementById(
    "toggleEditProductSelectionBtn"
  ),
  editProductSelectionWrapper: document.getElementById(
    "editProductSelectionWrapper"
  ),
  toggleEditProductIcon: document.getElementById("toggleEditProductIcon"),

  // Receipt Modal Elements
  receiptModal: document.getElementById("receiptModal"),
  receiptContent: document.getElementById("receiptContent"),
  printReceiptBtn: document.getElementById("printReceiptBtn"),
  closeReceiptModalBtn: document.getElementById("closeReceiptModalBtn"),

  // Backup Elements
  exportBackupBtn: document.getElementById("exportBackupBtn"),
  importBackupBtn: document.getElementById("importBackupBtn"),
  backupFileInput: document.getElementById("backupFileInput"),
};
