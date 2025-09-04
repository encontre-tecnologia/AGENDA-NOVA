import { elements } from "./domElements.js";
import { formatCurrency, calculateDays } from "./utils.js";

let products = [];
let rentals = [];

export const setRendererData = (newProducts, newRentals) => {
  products = newProducts;
  rentals = newRentals;
};

const getAvailableStock = (
  productId,
  startDate,
  endDate,
  rentalIdToExclude = null
) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return 0;

  let rentedOnPeriod = 0;
  if (
    startDate?.valueOf() &&
    endDate?.valueOf() &&
    new Date(startDate) <= new Date(endDate)
  ) {
    rentals.forEach((rental) => {
      if (rental.id === rentalIdToExclude || !rental.items[productId]) return;

      const rentalStart = new Date(rental.date);
      const rentalEnd = new Date(rental.returnDate);
      const targetStart = new Date(startDate);
      const targetEnd = new Date(endDate);

      if (!(targetEnd < rentalStart || targetStart > rentalEnd)) {
        rentedOnPeriod += rental.items[productId];
      }
    });
  }
  return product.quantity - rentedOnPeriod;
};

export const updateFinancialSummaries = () => {
  let totalRevenue = 0;
  let totalReceivable = 0;

  rentals.forEach((rental) => {
    const subtotal = Object.entries(rental.items).reduce(
      (sum, [itemId, qty]) => {
        const product = products.find((p) => p.id === itemId);
        return sum + (product ? product.price * qty : 0);
      },
      0
    );

    const finalPrice = Math.max(
      0,
      subtotal - (rental.discount || 0) + (rental.machineFee || 0)
    );
    const { totalInstallments = 1, paidInstallments = 0 } =
      rental.paymentInfo || {};
    const installmentValue =
      finalPrice > 0 ? finalPrice / totalInstallments : 0;

    totalRevenue += installmentValue * paidInstallments;
    totalReceivable += finalPrice - installmentValue * paidInstallments;
  });

  elements.totalRevenueValue.textContent = formatCurrency(totalRevenue);
  elements.totalReceivableValue.textContent = formatCurrency(
    totalReceivable > 0.005 ? totalReceivable : 0
  );
};

export const renderProductList = () => {
  elements.productList.innerHTML = "";
  if (products.length === 0) {
    elements.productList.innerHTML = `
            <li class="p-4 text-center text-slate-500 bg-slate-700 rounded-lg">
                Nenhum produto cadastrado.
            </li>
        `;
    return;
  }

  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.className =
      "flex items-center justify-between p-3 bg-slate-700 rounded-lg shadow-sm";
    productItem.innerHTML = `
            <div class="flex items-center gap-3 w-full min-w-0">
                <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-yellow-500/20 text-yellow-300 rounded-full">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </span>
                <div class="flex-grow min-w-0">
                    <p class="font-semibold text-slate-200 truncate" title="${
                      product.name
                    }">${product.name}</p>
                    <p class="text-xs text-slate-400">
                        <span class="mr-2">Estoque: <strong class="text-white">${
                          product.quantity
                        }</strong></span>
                        <span>Preço: <strong class="text-white">${formatCurrency(
                          product.price
                        )}/dia</strong></span>
                    </p>
                </div>
            </div>
            <div class="flex-shrink-0 flex items-center gap-2">
                <button class="edit-product-btn p-2 rounded-full hover:bg-sky-500/20 text-sky-400" data-id="${
                  product.id
                }" title="Editar Produto">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="pointer-events: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button class="delete-product-btn p-2 rounded-full hover:bg-red-500/20 text-red-400" data-id="${
                  product.id
                }" title="Excluir Produto">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="pointer-events: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
    elements.productList.appendChild(productItem);
  });
};

export const renderProductSelection = (
  container,
  currentSelected,
  rentalId,
  startDate,
  endDate
) => {
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = `<p class="text-slate-500 text-center col-span-full">Nenhum produto cadastrado para selecionar.</p>`;
    return;
  }

  products.forEach((p) => {
    const available = getAvailableStock(p.id, startDate, endDate, rentalId);
    const isSelected = currentSelected[p.id] > 0;
    const isDisabled = available <= 0 && !isSelected;

    const productCard = document.createElement("div");
    productCard.className = `
            relative p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer 
            ${
              isDisabled
                ? "bg-slate-700/50 border-transparent opacity-50 cursor-not-allowed"
                : "bg-slate-700 hover:border-sky-500"
            }
            ${
              isSelected
                ? "border-sky-500 shadow-lg shadow-sky-500/10"
                : "border-transparent"
            }
        `;

    if (!isDisabled) {
      productCard.dataset.productId = p.id;
    }

    productCard.innerHTML = `
            ${
              isSelected
                ? `
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white border-2 border-slate-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
            `
                : ""
            }
            <p class="font-bold text-slate-100 truncate">${p.name}</p>
            <div class="flex justify-between items-center mt-2 text-xs">
                <span class="text-slate-400">${formatCurrency(
                  p.price
                )}/dia</span>
                <span class="font-semibold px-2 py-1 rounded-full ${
                  available > 0
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                }">
                    ${available} disp.
                </span>
            </div>
        `;
    container.appendChild(productCard);
  });
};

export const renderSelectedItems = (
  container,
  currentSelected,
  rentalId,
  startDate,
  endDate
) => {
  container.innerHTML = "";
  if (
    Object.keys(currentSelected).length === 0 &&
    container.id === "selectedItemsContainer"
  ) {
    elements.noItemsSelected.classList.remove("hidden");
    return;
  }
  elements.noItemsSelected.classList.add("hidden");

  for (const [productId, quantity] of Object.entries(currentSelected)) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const available = getAvailableStock(
        productId,
        startDate,
        endDate,
        rentalId
      );
      const hasError = quantity > available;

      const itemCard = document.createElement("div");
      itemCard.className =
        "selected-item-card bg-slate-700 p-3 rounded-lg flex items-center gap-4";
      itemCard.dataset.productId = productId;
      itemCard.innerHTML = `
                <div class="flex-grow min-w-0">
                    <p class="font-semibold text-slate-100 truncate" title="${
                      product.name
                    }">${product.name}</p>
                    <p class="text-xs text-red-400 warning-message ${
                      hasError ? "" : "hidden"
                    }">Apenas ${available} em estoque!</p>
                </div>
                <input type="number" data-product-id="${productId}" value="${quantity}" placeholder="Qtd" class="quantity-input w-24 text-center ${
        hasError ? "input-error" : ""
      }">
                <button type="button" class="remove-item-btn p-2 rounded-full text-white bg-red-600 hover:bg-red-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="pointer-events: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>`;
      container.appendChild(itemCard);
    }
  }
};

export const renderRentalHistory = (searchTerm = "") => {
  elements.rentalHistoryList.innerHTML = "";
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
  const filteredRentals = rentals.filter(
    (r) =>
      !lowerCaseSearchTerm ||
      r.client.toLowerCase().includes(lowerCaseSearchTerm) ||
      new Date(r.date).toLocaleDateString("pt-BR").includes(lowerCaseSearchTerm)
  );

  if (filteredRentals.length === 0) {
    elements.rentalHistoryList.innerHTML = `<li class="text-center text-slate-500 py-12">Nenhum registro encontrado.</li>`;
    return;
  }

  filteredRentals.forEach((rental) => {
    const { totalInstallments = 1, paidInstallments = 0 } =
      rental.paymentInfo || {};

    const subtotal = Object.entries(rental.items).reduce(
      (sum, [itemId, qty]) => {
        const product = products.find((p) => p.id === itemId);
        return sum + (product ? product.price * qty : 0);
      },
      0
    );

    const discountAmount = rental.discount || 0;
    const machineFee = rental.machineFee || 0;
    const finalPrice = Math.max(0, subtotal - discountAmount + machineFee);
    const isFullyPaid =
      paidInstallments >= totalInstallments || finalPrice < 0.01;
    const statusBorderColor = isFullyPaid
      ? "border-emerald-500/50"
      : "border-amber-500/50";
    const li = document.createElement("li");
    li.className = `bg-slate-800 rounded-lg shadow-lg flex flex-col gap-4 p-5 border-2 ${statusBorderColor} transition-all duration-300`;

    const productItems = Object.keys(rental.items);
    const MAX_VISIBLE_ITEMS = 5;
    const visibleItems = productItems.slice(0, MAX_VISIBLE_ITEMS);
    const hiddenItemsCount = productItems.length - visibleItems.length;

    let itemsHtml = visibleItems
      .map((id) => {
        const product = products.find((p) => p.id === id);
        return product
          ? `
                <div class="inline-flex items-center bg-slate-700 rounded-full px-3 py-1 text-sm font-medium text-slate-200 max-w-full">
                    <span class="break-all">${product.name}</span>
                    <strong class="ml-2 text-teal-300 flex-shrink-0">${rental.items[id]}x</strong>
                </div>
            `
          : "";
      })
      .join("");

    if (hiddenItemsCount > 0) {
      itemsHtml += `<div class="bg-slate-600 rounded-full px-3 py-1 text-sm font-medium text-slate-300">+${hiddenItemsCount} mais</div>`;
    }

    const formattedDate = new Date(rental.date).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
    const formattedReturnDate = new Date(rental.returnDate).toLocaleDateString(
      "pt-BR",
      { timeZone: "UTC" }
    );
    const installmentValue =
      finalPrice > 0 ? finalPrice / totalInstallments : 0;
    const remainingBalance = finalPrice - installmentValue * paidInstallments;

    let installmentCirclesHTML = Array.from(
      { length: totalInstallments },
      (_, i) => i + 1
    )
      .map((i) => {
        const isPaid = i <= paidInstallments;
        const isNext = i === paidInstallments + 1;
        const canClick = isNext || i === paidInstallments;
        const title = canClick
          ? isNext
            ? `Marcar parcela ${i} paga`
            : `Desfazer pagamento ${i}`
          : `Parcela ${i}`;
        return `<button title="${title}" class="installment-circle-btn w-6 h-6 rounded-full transition-transform duration-200 ${
          isPaid ? "bg-emerald-500" : "bg-slate-600"
        } ${canClick ? "hover:scale-125" : "cursor-not-allowed"}" data-id="${
          rental.id
        }" data-installment-index="${i}"></button>`;
      })
      .join("");

    li.innerHTML = `
            <div>
                <div class="flex justify-between items-center">
                    <p class="text-sm text-slate-400">Cliente</p>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <button class="receipt-btn text-slate-500 hover:text-green-400 p-2 rounded-full hover:bg-slate-700" data-id="${
                          rental.id
                        }" title="Gerar Recibo"><svg class="w-5 h-5" style="pointer-events: none;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></button>
                        <button class="edit-rental-btn text-slate-500 hover:text-sky-400 p-2 rounded-full hover:bg-slate-700" data-id="${
                          rental.id
                        }" title="Editar"><svg class="w-5 h-5" style="pointer-events: none;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                        <button class="delete-rental-btn text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-700" data-id="${
                          rental.id
                        }" title="Apagar"><svg class="w-5 h-5" style="pointer-events: none;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    </div>
                </div>
                <div class="min-w-0">
                    <h3 class="text-xl font-bold text-purple-300 -mt-1 truncate" title="${
                      rental.client
                    }">${rental.client}</h3>
                    <p class="text-sm text-slate-400 mt-1">${formattedDate} a ${formattedReturnDate}</p>
                </div>
            </div>
            <div><div class="flex flex-wrap gap-2">${itemsHtml}</div></div>
            <div class="border-t border-slate-700 pt-4 flex justify-between items-end gap-4">
                <div>
                    <p class="text-xs uppercase font-semibold text-slate-500 tracking-wider">Status do Pagamento</p>
                    <div class="flex items-center gap-2 mt-2">${
                      totalInstallments > 1
                        ? installmentCirclesHTML
                        : `<div class="flex items-center gap-2"><div class="w-4 h-4 rounded-full ${
                            isFullyPaid ? "bg-emerald-500" : "bg-slate-600"
                          }"></div><p class="text-sm ${
                            isFullyPaid ? "text-emerald-300" : "text-slate-300"
                          } font-medium">Pagamento único</p></div>`
                    }</div>
                </div>
                <div class="text-right">
                    <p class="text-xs uppercase font-semibold text-slate-500 tracking-wider">Valor Pendente</p>
                    <p class="text-3xl font-bold ${
                      isFullyPaid ? "text-emerald-400" : "text-amber-400"
                    }">${formatCurrency(
      remainingBalance > 0.005 ? remainingBalance : 0
    )}</p>
                    <p class="text-sm text-slate-400">Total da locação: ${formatCurrency(
                      finalPrice
                    )}</p>
                </div>
            </div>`;
    elements.rentalHistoryList.appendChild(li);
  });
};

export const updateRentalFormSummary = (selectedItems) => {
  const {
    rentalDateInput,
    returnDateInput,
    rentalDiscountInput,
    rentalMachineFeeInput,
    rentalFormSummary,
  } = elements;

  if (
    !rentalDateInput.value ||
    !returnDateInput.value ||
    Object.keys(selectedItems).length === 0
  ) {
    rentalFormSummary.innerHTML = "";
    return;
  }

  const totalDays = calculateDays(rentalDateInput.value, returnDateInput.value);
  const subtotal = Object.entries(selectedItems).reduce(
    (sum, [itemId, qty]) => {
      const product = products.find((p) => p.id === itemId);
      if (product) {
        return sum + product.price * qty * totalDays;
      }
      return sum;
    },
    0
  );

  const discount = parseFloat(rentalDiscountInput.value) || 0;
  const machineFee = parseFloat(rentalMachineFeeInput.value) || 0;
  const total = subtotal - discount + machineFee;

  rentalFormSummary.innerHTML = `
        <div class="text-right space-y-1 text-slate-300">
            <p class="text-sm">Subtotal: <span class="font-semibold">${formatCurrency(
              subtotal
            )}</span></p>
            ${
              discount > 0
                ? `<p class="text-sm text-red-400">Desconto: <span class="font-semibold">-${formatCurrency(
                    discount
                  )}</span></p>`
                : ""
            }
            ${
              machineFee > 0
                ? `<p class="text-sm text-sky-400">Juros/Taxas: <span class="font-semibold">+${formatCurrency(
                    machineFee
                  )}</span></p>`
                : ""
            }
            <p class="text-xl font-bold text-white">Total: <span class="text-teal-400">${formatCurrency(
              total
            )}</span></p>
        </div>
    `;
};
