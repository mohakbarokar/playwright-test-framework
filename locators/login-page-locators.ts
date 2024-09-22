export const loginPageLocators = {
    HOME_PAGE_LINK_ROLE: 'role=link[name="Polestar"]',
    USERNAME_INPUT_ID: '#email-username-field',
    PASSWORD_INPUT_ID: '#password-field',
    FORGOT_PWD_LINK: '#forgotPassword',
    GET_POLESTAR_ID_BTN_ID: '#get-polestar-id-btn',
    LOGIN_BTN_ID: '#login-btn',
    LOGIN_WITH_PHONE_RADIO_BTN_ID: '#phoneSwitch',
    LOGIN_WITH_EMAIL_RADIO_BTN_ID: '#emailSwitch',
    COOKIE_NOTICE_TEXT_ID: '#cookie-notice-text',
    COPYRIGHT_TEXT_XPATH: `//p[@id='cookie-notice-text']/preceding-sibling::p[@class='resource']`,
    EMAIL_ERROR_MESSAGE_TEXT_XPATH: `//div[@id='email-username-field-line']/following-sibling::div`,
    PWD_ERROR_MESSAGE_TEXT_XPATH: `//div[@id='password-field-line']/following-sibling::div`,
    LOGIN_ERROR_SECTION_ID: '#errorSection',
};

// 'role=link[name="Polestar"]',
// page.getByRole('link', { name: 'Polestar' });