// Comentario por cualquier cosa

export function formatCurrency(value, currency = 'USD', locale = 'es-SV') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

export function parseCurrency(formattedString) {
  const numeric = formattedString.replace(/[^0-9,.-]+/g, '').replace(',', '.');
  return parseFloat(numeric);
}