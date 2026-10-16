import type { Legal } from "./schema";

// Draft by Claude for Laurin to review (Phase 6). Not legal advice. Describes
// exactly what the site does: server logs only, next-themes (localStorage),
// next/font (self-hosted), no third-party requests (tests/e2e/legal.spec.ts).

const address = {
  de: "TODO(laurin): Straße und Hausnummer, PLZ und Ort für das Impressum",
  en: "TODO(laurin): street and number, postcode and city for the legal notice",
};

export const legal: Legal = {
  imprint: {
    title: { de: "Impressum", en: "Legal notice" },
    basis: {
      de: "Angaben gemäß § 5 DDG",
      en: "Information pursuant to § 5 DDG (German Digital Services Act)",
    },
    name: "Laurin Werner",
    address,
    contactLabel: { de: "Kontakt", en: "Contact" },
    responsibleLabel: {
      de: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      en: "Responsible for the content pursuant to § 18 (2) MStV",
    },
    responsible: {
      de: "Laurin Werner, Anschrift wie oben",
      en: "Laurin Werner, address as above",
    },
  },
  privacy: {
    title: { de: "Datenschutzerklärung", en: "Privacy policy" },
    updated: { de: "Stand: Oktober 2026", en: "Last updated: October 2026" },
    sections: [
      {
        title: { de: "Verantwortlicher", en: "Controller" },
        paragraphs: [
          {
            de: "Verantwortlich für die Datenverarbeitung auf dieser Website ist Laurin Werner (Anschrift im Impressum), E-Mail: laurin.werner@protonmail.com.",
            en: "The controller for data processing on this website is Laurin Werner (address in the legal notice), e-mail: laurin.werner@protonmail.com.",
          },
        ],
      },
      {
        title: { de: "Das Wichtigste in Kürze", en: "Summary" },
        paragraphs: [
          {
            de: "Diese Website setzt keine Cookies, nutzt keine Analyse- oder Tracking-Dienste und lädt keine Inhalte von Drittanbietern: Schriften und Bilder werden vom eigenen Server ausgeliefert. Verarbeitet werden nur die Daten, die für die Auslieferung der Seiten nötig sind.",
            en: "This website sets no cookies, uses no analytics or tracking services and loads no content from third parties: fonts and images are served from its own server. Only the data needed to deliver the pages is processed.",
          },
        ],
      },
      {
        title: {
          de: "Hosting und Server-Logdateien",
          en: "Hosting and server log files",
        },
        paragraphs: [
          {
            de: "TODO(laurin): Hosting-Anbieter und Serverstandort (und ob ein Vertrag zur Auftragsverarbeitung besteht)",
            en: "TODO(laurin): hosting provider and server location (and whether a data processing agreement is in place)",
          },
          {
            de: "Bei jedem Aufruf verarbeitet der Server automatisch folgende Daten:",
            en: "With every request, the server automatically processes the following data:",
          },
        ],
        list: [
          { de: "IP-Adresse", en: "IP address" },
          { de: "Datum und Uhrzeit", en: "date and time" },
          {
            de: "aufgerufene Adresse und Statuscode",
            en: "requested address and status code",
          },
          {
            de: "Referrer (die zuvor besuchte Seite), sofern übermittelt",
            en: "referrer (the previously visited page), if sent",
          },
          {
            de: "Browser und Betriebssystem (User-Agent)",
            en: "browser and operating system (user agent)",
          },
        ],
        after: [
          {
            de: "Zweck ist die Auslieferung der Website sowie die Sicherheit und Fehleranalyse des Servers. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im sicheren und funktionsfähigen Betrieb der Website.",
            en: "The purpose is to deliver the website and to keep the server secure and analyse its errors. The legal basis is Art. 6(1)(f) GDPR; the legitimate interest is the secure and working operation of the website.",
          },
          {
            de: "TODO(laurin): Speicherdauer der Server-Logdateien",
            en: "TODO(laurin): retention period of the server log files",
          },
        ],
      },
      {
        title: {
          de: "Cookies und lokaler Speicher",
          en: "Cookies and local storage",
        },
        paragraphs: [
          {
            de: "Diese Website setzt keine Cookies. Wenn Sie das Farbschema umschalten, wird Ihre Wahl im lokalen Speicher Ihres Browsers (localStorage, Eintrag „theme“) abgelegt, damit sie beim nächsten Besuch erhalten bleibt. Dieser Eintrag verlässt Ihr Gerät nicht und ist für die von Ihnen gewünschte Funktion unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können ihn jederzeit über die Einstellungen Ihres Browsers löschen.",
            en: "This website sets no cookies. If you switch the colour scheme, your choice is kept in your browser's local storage (localStorage, entry “theme”) so that it remains on your next visit. This entry never leaves your device and is strictly necessary for the function you asked for (§ 25(2) no. 2 TDDDG). You can delete it at any time in your browser settings.",
          },
        ],
      },
      {
        title: { de: "Schriften", en: "Fonts" },
        paragraphs: [
          {
            de: "Die Schrift Archivo wird vom Server dieser Website geladen. Es besteht keine Verbindung zu Google oder anderen Schriftanbietern.",
            en: "The Archivo typeface is loaded from this website's server. There is no connection to Google or other font providers.",
          },
        ],
      },
      {
        title: { de: "Kontakt per E-Mail", en: "Contact by e-mail" },
        paragraphs: [
          {
            de: "Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre Adresse und Ihre Nachricht, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um ein Arbeits- oder Auftragsverhältnis geht, sonst Art. 6 Abs. 1 lit. f DSGVO. Das Postfach wird von der Proton AG in der Schweiz betrieben; für die Schweiz besteht ein Angemessenheitsbeschluss der EU-Kommission. Ich lösche die Nachrichten, sobald sie nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten bestehen.",
            en: "If you send me an e-mail, I process your address and your message to answer your request. The legal basis is Art. 6(1)(b) GDPR where it concerns an employment or contract relationship, otherwise Art. 6(1)(f) GDPR. The mailbox is operated by Proton AG in Switzerland; the EU Commission has issued an adequacy decision for Switzerland. I delete messages once they are no longer needed and no statutory retention obligations apply.",
          },
        ],
      },
      {
        title: {
          de: "Links zu anderen Websites",
          en: "Links to other websites",
        },
        paragraphs: [
          {
            de: "Diese Website verlinkt auf LinkedIn und GitHub. Daten werden an diese Anbieter erst übermittelt, wenn Sie einem Link folgen; dann gelten deren Datenschutzerklärungen.",
            en: "This website links to LinkedIn and GitHub. Data is only transmitted to these providers once you follow a link; their privacy policies then apply.",
          },
        ],
      },
      {
        title: { de: "Ihre Rechte", en: "Your rights" },
        paragraphs: [
          {
            de: "Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, widersprechen (Art. 21). Eine formlose E-Mail genügt.",
            en: "You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18) and data portability (Art. 20). You may object to processing based on Art. 6(1)(f) GDPR on grounds relating to your particular situation (Art. 21). An informal e-mail is enough.",
          },
          {
            de: "Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), etwa bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.",
            en: "You may also lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), for example the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia.",
          },
        ],
      },
    ],
  },
};
