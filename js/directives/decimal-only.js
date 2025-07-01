export function allowDecimalInput(inputElement) {
    inputElement.addEventListener('keydown', (event) => {
        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '.', 'Delete'];
        const regex = /^\d*\.?\d{0,3}$/;
        if (allowedKeys.includes(event.key)) return;
        const value = inputElement.value;
        const cursorPos = inputElement.selectionStart;
        const next = value.slice(0, cursorPos) + event.key + value.slice(cursorPos);
        if (!regex.test(next)) event.preventDefault();
    });
}