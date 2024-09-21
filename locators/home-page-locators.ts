export const homePageLocators = {
    EULA_DIALOG_BOX_TITLE_ID: '#onetrust-policy-title',
    EULA_DIALOG_BOX_TEXT: '#onetrust-policy-text',
    EULA_DIALOG_BOX_REJECT_BTN: '#onetrust-reject-all-handler',
    EULA_DIALOG_BOX_ACCEPT_BTN: '#onetrust-accept-btn-handler',
    CURRENT_DISPLAYED_MODELS_ON_HOME_PAGE: `//main[@id='main-content']/div/div/section/div[2]//h1[contains(text(), 'Polestar')] | //main[@id='main-content']/div/div/section/div[2]//h2[contains(text(), 'Polestar')]`,
    GET_POLESTAR_DISCOVER_BUTTON: (number: number) => `a[role='link'][href='/se/polestar-${number}/']`,
    NAVIGATION_ICONS: {
        FIND_US_BTN_TITLE: 'Hitta till oss',
        USER_ACCOUNT_BTN_TITLE: 'Användarkonto'
    },
    NAVIGATION_BUTTONS: {
        POLESTAR_2: 'Polestar 2',
        POLESTAR_3: 'Polestar 3',
        POLESTAR_4: 'Polestar 4',
        CHARGE: 'Laddning',
        BUY: 'Köpa',
        MORE: 'Mer',
    }
};