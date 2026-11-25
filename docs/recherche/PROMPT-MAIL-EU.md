# Deep-Research-Prompt: EU-Anbieter für Transaktions- und Newsletter-Mails

Recherchiere für eine deutsche Webagentur (Einzelunternehmer, Kunden-Homepages, Newsletter als optionales Zusatzmodul) den besten Anbieter für E-Mail-Versand mit Sitz und Datenverarbeitung in der EU. Der Anbieter wird fast ausschließlich über API, Kommandozeile oder MCP-Server von KI-Werkzeugen bedient; Klickarbeit im Dashboard soll die Ausnahme sein.

Kandidaten (prüfe diese und ergänze weitere EU-Anbieter, falls sie besser passen): Brevo, Mailjet, MailerSend, Scaleway Transactional Email, Lettermint, Mailgun EU-Region, Amazon SES Region EU (nur zum Vergleich), sowie ein selbst betriebener Weg (nur kurz einordnen).

Arbeite ausschließlich mit offiziellen Quellen (Produktseiten, API-Dokumentation, Preisseiten, Datenschutz- und Vertragsunterlagen, Sub-Processor-Listen, Status- und Changelog-Seiten). Blogvergleiche nur als Hinweis, nie als Beleg. Gib zu jeder Aussage Quelle (URL) und Abrufdatum an. Was du nicht belegen kannst, markiere als NICHT BELEGT, rate nicht.

Beantworte je Anbieter diese Punkte:
1. Firmensitz, Konzernzugehörigkeit (US-Mutter oder Käufer?), Rechenzentrums-Standorte, Speicherort von Konto- und Protokolldaten, Unterauftragsverarbeiter außerhalb der EU.
2. Vertrag zur Auftragsverarbeitung: online abschließbar, vorab unterzeichnet, Ort des Dokuments, Drittlandgarantien.
3. Programmierbarkeit: REST-API-Abdeckung für Domain anlegen, DNS-Einträge (SPF, DKIM, DMARC) abrufen, Domain-Prüfung anstoßen, API-Schlüssel je Kunde anlegen, Schlüssel auf eine Domain oder auf reines Senden beschränken, Absender, Kontakte, Listen, Segmente, Kampagnen, Webhooks. Gibt es offizielle Kommandozeile, SDKs, MCP-Server (gehostet oder lokal, Anmeldung per OAuth oder Schlüssel, Rechtebegrenzung)?
4. Newsletter-Funktionen per API: Double-Opt-in (eigener Ablauf oder eigene Bestätigungsmails), Abmeldelink und Ein-Klick-Abmeldung (List-Unsubscribe und List-Unsubscribe-Post), Sperrlisten, Umgang mit Rückläufern und Beschwerden, Idempotenz beim Senden, Webhook-Signaturprüfung und Ereignisnamen, Batch-Versand.
5. Mandantentrennung: Kann ein Agenturkonto viele Kundendomains und Kundenschlüssel getrennt verwalten? Beeinträchtigt ein Kunde mit Beschwerden die Zustellbarkeit der anderen? Gibt es Unterkonten, Subaccounts oder getrennte IP-Reputation?
6. Preise (netto und brutto in Euro) für: 1 Domain mit wenigen hundert Mails im Monat; 5 bis 10 Kunden-Domains mit je bis zu 2.000 Mails; Newsletter-Versand bis 10.000 Empfänger. Kostenlose Stufen und deren Grenzen (Werbezeile, Tageslimit, Domainanzahl), Prüfung neuer Konten vor dem Versand, Mindestlaufzeiten.
7. Zustellbarkeit: unabhängige Messungen, Erfahrung mit Postfächern in Deutschland (GMX, Web.de, T-Online, Gmail, Outlook), Hinweise auf Missbrauchsfilter oder Kontosperren bei neuen Agenturkonten.
8. Grenzen und Fallstricke: Ratenlimits, Verbot von Marketingmails bei reinen Transaktionstarifen, Pflicht zur Ausweisprüfung, Wartezeiten bei Kontofreigabe, Ausfallgeschichte.

Liefere am Ende: (a) eine Vergleichstabelle (Zeilen: Anbieter, Spalten: Sitz/Datenort, Vertrag, API-Abdeckung für Domains und Schlüssel, MCP/CLI, Newsletter per API, Mandantentrennung, Preis für die drei Szenarien, Zustellbarkeit, Risiken), (b) eine Rangfolge mit Begründung für den Einsatz „viele Kundendomains, minimal manuelle Einrichtung, Newsletter mit Double-Opt-in“, (c) eine Liste der Punkte, die noch ein Test mit einem echten Konto klären muss, (d) eine Liste der Quellen mit Datum. Antworte auf Deutsch. Keine Rechtsberatung, aber nenne Punkte, die ein Anwalt prüfen sollte.
