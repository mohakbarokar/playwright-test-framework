export const genericLocators = {
    BUTTON_WITH_TEXT: (buttonText: string) => `button:has-text("${buttonText}")`,
    ELEMENT_WITH_TEXT: (elementType: string, text: string) => `//${elementType}[text()="${text}"]`,
    LABEL_WITH_TEXT: (labelText: string) => `label:has-text("${labelText}")`
};