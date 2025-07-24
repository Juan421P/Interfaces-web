const allowedKeys = [
  'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'
];

const patterns = {
  username: /^[A-Za-z0-9]$/,
  simpleText: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]$/,
  normalText: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9.,\s]$/,
  password: /^[A-Za-z0-9#!@&]$/,
  number: /^\d$/,
  decimal: /^\d*\.?\d{0,3}$/,
  email: /^[A-Za-z0-9@.]$/
}

/**
*   Le adhiere a un elemento validación mientras que el usuario ingresa datos
*
*   @param {string} selector
*   @param {keyof typeof patterns} [kind='username']
*/
export function checkInput(selector, kind = 'username') {
  const element = document.querySelector(selector);
  if (!element) return;

  element.addEventListener('keydown', e => {
    console.log(`Key pressed: ${e.key}, Pattern used: ${kind}`); // Log the kind being used
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      console.log('Allowed key or modifier, returning.');
      return;
    }
    const isAllowedChar = patterns[kind].test(e.key);
    console.log(`Is character allowed by pattern (${patterns[kind].source})? ${isAllowedChar}`);
    if (!isAllowedChar) {
      e.preventDefault();
      console.log(`Prevented default for key: ${e.key}`);
    }
  });

  element.addEventListener('paste', e => {
    e.preventDefault();
  });
}

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