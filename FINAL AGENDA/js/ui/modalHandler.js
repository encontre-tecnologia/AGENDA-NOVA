import { elements } from "./domElements.js";
import { formatCurrency, calculateDays } from "./utils.js";

// Variáveis para guardar os dados do recibo atual
let currentRentalForPrinting = null;
let allProductsForPrinting = null;

export const showModal = (content, onConfirm = null) => {
  elements.modalContent.innerHTML = content;
  const footer = elements.modalFooter;

  const oldConfirmBtn = footer.querySelector("#confirmModalBtn");
  if (oldConfirmBtn) {
    oldConfirmBtn.remove();
  }

  if (onConfirm) {
    const confirmButton = document.createElement("button");
    confirmButton.id = "confirmModalBtn";
    confirmButton.className =
      "py-2 px-5 text-white bg-red-500 hover:bg-red-600 rounded-md";
    confirmButton.textContent = "Confirmar";
    footer.prepend(confirmButton);
    confirmButton.onclick = () => {
      elements.modal.classList.add("hidden");
      onConfirm();
    };
    elements.closeModalBtn.textContent = "Cancelar";
  } else {
    elements.closeModalBtn.textContent = "Fechar";
  }

  elements.modal.classList.remove("hidden");
};

elements.closeModalBtn.addEventListener("click", () => {
  elements.modal.classList.add("hidden");
});

export const generateReceipt = (rental, products) => {
  currentRentalForPrinting = rental;
  allProductsForPrinting = products;

  const onScreenContent = createReceiptHTML(rental, products, "dark");
  elements.receiptContent.innerHTML = onScreenContent;
  elements.receiptModal.classList.remove("hidden");
};

const createReceiptHTML = (rental, products, theme = "light") => {
  // Coloque o caminho para a sua imagem aqui.
  // O caminho deve ser relativo ao seu arquivo index.html.
  // Exemplo: se sua logo está em uma pasta 'images', o caminho seria 'images/sua-logo.png'
  const logoUrl = "./img/logo.png"; // <-- Verifique se este caminho está correto

  const isDark = theme === "dark";
  const colors = {
    text: isDark ? "text-slate-300" : "text-slate-800",
    textMuted: isDark ? "text-slate-400" : "text-slate-600",
    title: isDark ? "text-teal-300" : "text-teal-600",
    border: isDark ? "border-slate-600" : "border-gray-300",
    tableHeadBg: isDark ? "bg-slate-700" : "bg-gray-100",
    tableHeadText: isDark ? "text-slate-200" : "text-slate-700",
    tableRowBorder: isDark ? "border-slate-700" : "border-gray-200",
  };

  const companyName = "São pedro Locações ";
  const companyAddress = "Rua ovando salvador baio 002, São Carlos - SP";
  const companyPhone = "(16) 99439-2545";
  const receiptDate = new Date().toLocaleDateString("pt-BR");
  const formattedRentalDate = new Date(rental.date).toLocaleDateString(
    "pt-BR",
    { timeZone: "UTC" }
  );
  const formattedReturnDate = new Date(rental.returnDate).toLocaleDateString(
    "pt-BR",
    { timeZone: "UTC" }
  );
  const totalDays = calculateDays(rental.date, rental.returnDate);

  let itemsTableRows = "";
  let subtotal = 0;
  Object.entries(rental.items).forEach(([itemId, quantity]) => {
    const product = products.find((p) => p.id === itemId);
    if (product) {
      const itemPrice = product.price * quantity * totalDays;
      subtotal += itemPrice;
      itemsTableRows += `
                <tr class="border-b ${colors.tableRowBorder} last:border-b-0">
                    <td class="py-2 pr-4">${product.name}</td>
                    <td class="py-2 px-4 text-center">${quantity}</td>
                    <td class="py-2 px-4 text-right">${formatCurrency(
                      product.price
                    )}</td>
                    <td class="py-2 pl-4 text-right">${formatCurrency(
                      itemPrice
                    )}</td>
                </tr>
            `;
    }
  });

  const discountAmount = rental.discount || 0;
  const machineFee = rental.machineFee || 0;
  const finalPrice = Math.max(0, subtotal - discountAmount + machineFee);

  // Calcular o total pago com base nos pagamentos registrados
  const totalPaid = (rental.payments || []).reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const remainingBalance = Math.max(0, finalPrice - totalPaid); // Garante que não fique negativo

  const { totalInstallments = 1, paidInstallments = 0 } =
    rental.paymentInfo || {};
  const installmentValue = finalPrice > 0 ? finalPrice / totalInstallments : 0;

  return `
        <div class="font-sans ${colors.text}">
            <div class="text-center mb-8">
                <img src="${logoUrl}" alt="Logo da Empresa" 
                     style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem auto; border: 2px solid ${
                       isDark ? "#475569" : "#e2e8f0"
                     };">
                <h2 class="text-2xl font-bold ${
                  colors.title
                }">${companyName}</h2>
                <p class="text-sm ${colors.textMuted}">${companyAddress}</p>
                <p class="text-sm ${colors.textMuted}">${companyPhone}</p>
            </div>

            <div class="border-t border-b ${colors.border} py-4 mb-6">
                <p class="flex justify-between mb-1"><strong>Recibo Nº:</strong> <span>${rental.id
                  .substring(0, 8)
                  .toUpperCase()}</span></p>
                <p class="flex justify-between mb-1"><strong>Data de Emissão:</strong> <span>${receiptDate}</span></p>
                <p class="flex justify-between"><strong>Cliente:</strong> <span>${
                  rental.client
                }</span></p>
                ${
                  rental.address
                    ? `<p class="flex justify-between"><strong>Endereço:</strong> <span>${rental.address}</span></p>`
                    : ""
                }
            </div>
            <div class="mb-6">
                <h2 class="text-lg font-semibold ${
                  colors.tableHeadText
                } mb-3">Detalhes da Locação:</h2>
                <p class="mb-1"><strong>Período:</strong> ${formattedRentalDate} a ${formattedReturnDate} (${totalDays} dias)</p>
            </div>
            <div class="mb-6">
                <h2 class="text-lg font-semibold ${
                  colors.tableHeadText
                } mb-3">Itens Locados:</h2>
                <table class="w-full text-left table-auto">
                    <thead>
                        <tr class="${colors.tableHeadBg} border-b ${
    colors.border
  }">
                            <th class="py-2 pr-4 font-semibold">Item</th>
                            <th class="py-2 px-4 text-center font-semibold">Qtd.</th>
                            <th class="py-2 px-4 text-right font-semibold">Preço/Dia</th>
                            <th class="py-2 pl-4 text-right font-semibold">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${itemsTableRows}</tbody>
                </table>
            </div>
            <div class="border-t ${colors.border} pt-4 text-right">
                <p class="text-lg font-semibold mb-1">Subtotal: <span>${formatCurrency(
                  subtotal
                )}</span></p>
                ${
                  discountAmount > 0
                    ? `<p class="text-lg font-semibold text-red-500 mb-1">Desconto: <span>-${formatCurrency(
                        discountAmount
                      )}</span></p>`
                    : ""
                }
                ${
                  machineFee > 0
                    ? `<p class="text-lg font-semibold text-sky-500 mb-1">Juros/Taxas: <span>+${formatCurrency(
                        machineFee
                      )}</span></p>`
                    : ""
                }
                <p class="text-2xl font-bold mb-1">Total da Locação: <span class="${
                  colors.title
                }">${formatCurrency(finalPrice)}</span></p>
                <p class="text-lg font-semibold mb-1">Total Pago: <span>${formatCurrency(
                  totalPaid
                )}</span></p>
                ${
                  remainingBalance > 0.01
                    ? `<p class="text-lg font-semibold text-amber-500">Valor Pendente: <span>${formatCurrency(
                        remainingBalance
                      )}</span></p>`
                    : `<p class="text-lg font-semibold text-emerald-500">Status: <span>Quitado</span></p>`
                }
            </div>
        </div>
    `;
};

elements.closeReceiptModalBtn.addEventListener("click", () => {
  elements.receiptModal.classList.add("hidden");
  currentRentalForPrinting = null;
  allProductsForPrinting = null;
});

elements.printReceiptBtn.addEventListener("click", () => {
  if (!currentRentalForPrinting || !allProductsForPrinting) return;

  const printContent = createReceiptHTML(
    currentRentalForPrinting,
    allProductsForPrinting,
    "light"
  );

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html>
            <head>
                <title>Recibo - ${currentRentalForPrinting.client}</title>
                <base href="${window.location.href}">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { 
                        font-family: 'Poppins', sans-serif; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                </style>
            </head>
            <body>
                <div class="p-8">
                    ${printContent}
                </div>
                <script>
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 250);
                </script>
            </body>
        </html>
    `);
  printWindow.document.close();
});
