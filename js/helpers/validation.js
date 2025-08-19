/** @param {string} str – Estrictamente alfanumérico */
export const isValidUsername = str => /^[A-Za-z0-9]+$/.test(str.trim());

/** @param {string} str – Letras, números, espacios. Casi toda la vaina */
export const isValidSimpleText = str => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]+$/.test(str.trim());

/** @param {string} str – Letras, números, comas, espacios. Toda la vaina */
export const isValidNormalText = str => /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9.,\s]+$/.test(str.trim());

/** @param {string} str – Letras, números, # ! @ & */
export const isValidPassword = str => /^[A-Za-z0-9#!@&]+$/.test(str.trim());

/** @param {string} str – Solo los meros números */
export const isValidNumber = str => /^\d+$/.test(str.trim());

/** @param {string} str – Decimales con menos de 3 o menos dígitos después del punto decimal */
export const isValidDecimal = str => /^\d+(\.\d{1,3})?$/.test(str.trim());

/** @param {string} str – Para correos xd */
export const isValidEmail = str => /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.(?:[A-Za-z]{2,}|edu\.sv)$/.test(str.trim());