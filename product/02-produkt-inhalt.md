# Schritt 2 — Das Produkt bauen

## Bau-Prompt (in Claude einfügen)
> Ich möchte ein digitales Produkt bauen: **Dienstübergabe & Arztbrief Toolkit** für Ärztinnen und Ärzte in Deutschland.
> Ziel: Käufer kommen vom Problem (chaotische Übergabe, langsame Briefe) zum Ergebnis in kürzester Zeit, ohne Theorie.
> 1. Erstelle ein Inhaltsverzeichnis mit 5 praktischen Stationen.
> 2. In jeder Station: keine langen Erklärungen, sondern Ausfüll-Vorlagen, Checklisten, Tabellen und nummerierte Schritte.
> 3. Nutze Artifacts für ein interaktives Hilfstool.
> Regeln: nur fiktive Beispiele, keine Dosierungen oder Diagnosen, Haftungshinweis.

## Haftungshinweis (auf Seite 2 des Produkts)
Dieses Produkt liefert Organisationsvorlagen. Es ersetzt keine ärztliche Beurteilung, keine Leitlinien und keine hausinternen Standards. Keine Patientendaten eintragen oder speichern. Beispiele sind frei erfunden. Kein Medizinprodukt.

## Inhaltsverzeichnis
1. SBAR-Übergabe in 90 Sekunden
2. Stationsübergabe: Schicht-Checkliste
3. Arztbrief/Epikrise: Baukasten
4. Eskalation & offene Punkte
5. Selbstcheck & Team-Einführung

## Station 1 — SBAR-Übergabe in 90 Sekunden
**Schritte**
1. Zimmer/Bett und Alias nennen (kein Name in schriftlichen Notizen).
2. S, B, A, R nacheinander, je ein bis zwei Sätze.
3. Offene Aufgaben mit Frist nennen.
4. Rückfrage des Empfängers einholen („Verstanden, wiederholt“).

| Feld | Leitfrage | Beispiel (fiktiv) |
|---|---|---|
| **S** Situation | Warum übergebe ich diesen Fall jetzt? | Bett 12, Alias „A“, Fieber seit heute früh |
| **B** Background | Relevante Vorgeschichte und Verlauf | Aufnahme vor 2 Tagen wegen Pneumonie |
| **A** Assessment | Meine aktuelle Einschätzung, Unsicherheit | Verlauf unklar, Labor ausstehend |
| **R** Recommendation | Was soll der Empfänger tun, bis wann? | Kontrolle um 20 Uhr, bei Verschlechterung Oberarzt |

## Station 2 — Schicht-Checkliste
- [ ] Alle Patienten der Liste durchgesprochen
- [ ] Instabile Fälle zuerst übergeben
- [ ] Ausstehende Befunde mit Zuständigkeit notiert
- [ ] Code-Status/Patientenverfügung erwähnt, sofern vorhanden
- [ ] Offene Telefonate und Konsile genannt
- [ ] Rückfragen beantwortet, Erreichbarkeit geklärt

## Station 3 — Arztbrief-Baukasten (Gerüst)
| Abschnitt | Inhalt | Fehlerquelle |
|---|---|---|
| Anlass | Aufnahmegrund in einem Satz | zu lang |
| Diagnosen | Haupt-/Nebendiagnosen als Liste | unvollständig |
| Verlauf | Chronologisch, kurz | Wichtiges fehlt |
| Befunde | Nur Relevantes, mit Datum | Werte ohne Einheit |
| Medikation | Wie in der Akte, von Arzt geprüft | Abweichung bei Entlassung |
| Empfehlung | Konkrete Schritte für Hausarzt | vage |

Regel: Jeden Abschnitt vor Versand ärztlich gegenprüfen.

## Station 4 — Eskalation & offene Punkte
| Offener Punkt | Verantwortlich | Frist | Erledigt |
|---|---|---|---|
| | | | ☐ |

Eskalationsstufen: erst eigene Einschätzung, dann Oberarzt, bei Notfall nach lokalem Notfallstandard. Hausinterne Regeln gehen immer vor.

## Station 5 — Selbstcheck
- Habe ich meine Übergabe in unter zwei Minuten geschafft?
- Kann der Empfänger ohne Rückfrage handeln?
- Steht jede Aufgabe mit Frist und Zuständigkeit?
- Wurde kein Patientenname in nicht freigegebenen Medien verwendet?

## Interaktives Tool
`sbar-tool.html`: Formular, das aus S/B/A/R eine kopierbare Übergabe erzeugt. Läuft komplett im Browser, speichert nichts und sendet nichts.
