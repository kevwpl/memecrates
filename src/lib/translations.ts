import {t} from "$lib/i18n.svelte";

export const translations: Record<string, Record<string, string>> = {
    'en': {
        'nav.dashboard': 'Dashboard',
        'nav.receipts': 'Invoices',
        'nav.management': 'Management',
        'nav.companies': 'Companies',
        'nav.general': 'General',
        'nav.customers': 'Customers',
        'nav.services': 'Services',
        'nav.products': 'Products',
        'nav.company': 'Company',
        'nav.settings': 'Settings',
        'nav.users': 'Users',


        'dashboard.title': "Dashboard",
        'dashboard.dashboard': 'Dashboard',

        'invoices.title': "Invoices",
        'invoices.invoices': "Invoices",
        'invoices.desc': "Here you can see all your receipts",

        'services.title': "Services",
        'services.services': "Services",
        'services.desc': "Here you can see all your services",

        'customers.title': "Customers",
        'customers.customers': "Customers",
        'customers.desc': "Here you can see all your customers",
        'customers.name': "Name",
        'customers.street': "Street",
        'customers.zip': "Zip",
        'customers.town': "Town",
        'customers.uid': "UID",
        'customers.addcustomer': "Add customer",
        'customers.submit': "Submit",

        'login.title': "Login",
        'login.login': "Login",
        'login.desc': "Enter your credentials to login",
        'login.examplemail': "Email or username",
        'login.tos': "By clicking continue, you agree to our",
        'login.tos2': "and",
        'login.notfound': "Email or password incorrect",

        'pagination.previous': "Previous",
        'pagination.next': "Next",
        'pagination.results': "Results",
    },
    'de': {
        'nav.dashboard': 'Zusammenfassung',
        'nav.receipts': 'Rechnungen',
        'nav.management': 'Management',
        'nav.companies': 'Unternehmen',
        'nav.general': 'Allgemein',
        'nav.customers': 'Kunden',
        'nav.services': 'Leistungen',
        'nav.products': 'Produkte',
        'nav.company': 'Unternehmen',
        'nav.settings': 'Einstellungen',
        'nav.users': 'Benutzer',

        'dashboard.title': "Zusammenfassung",
        'dashboard.dashboard': 'Zusammenfassung',

        'invoices.title': "Rechnungen",
        'invoices.invoices': "Rechnungen",
        'invoices.desc': "Hier kannst du alle deine Rechnungen sehen",

        'services.title': "Leistungen",
        'services.services': "Leistungen",
        'services.desc': "Hier kannst du alle deine Leistungen sehen",

        'customers.title': "Kunden",
        'customers.customers': "Kunden",
        'customers.desc': "Hier kannst du alle deine Kunden sehen",
        'customers.name': "Name",
        'customers.street': "Straße",
        'customers.zip': "PLZ",
        'customers.town': "Stadt",
        'customers.uid': "UID",
        'customers.addcustomer': "Kunde hinzufügen",
        'customers.submit': "Bestätigen",

        'login.title': "Anmelden",
        'login.login': "Anmelden",
        'login.desc': "Gib deine Anmeldedaten an um dich anzumelden",
        'login.examplemail': "Email oder Benutzername",
        'login.tos': "Wenn du dich anmeldest akzeptierst du automatisch unsere",
        'login.tos2': "und",
        'login.notfound': "Email oder Passwort falsch",

        'pagination.previous': "Zurück",
        'pagination.next': "Weiter",
        'pagination.results': "Ergebnisse",
    }
};