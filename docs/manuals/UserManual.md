# Benutzerhandbuch

> Dieses Handbuch richtet sich an User ohne Admin Rechte. User mit Admin-Rechten haben natürlich auch Zugriff auf alle
> hier gelisteten Funktionen.

## Login
Das Login-Interface findet ihr unter `domain.com/login` dort meldet man sich mit den vom Administrator vergebenen E-Mail-
und Passwort-Daten an.

## Account-Einstellungen
Eure Account-Einstellungen könnt ihr auf zwei Wegen erreichen:
- Ändert die URL zu `domain.com/account`
- Klickt auf "Account" in der Sidebar

### Passwort ändern
Sobald ihr euch eingeloggt habt, solltet ihr euer Passwort ändern. 
- Gebt euer aktuelles Passwort in das Feld "Aktuelles Passwort" ein.
- Gebt euer neues Passwort in die Felder "Neues Passwort" und "Wiederhole dein neues Passwort" ein
    Ein Passwort muss aus:
    - mindestens einem Großbuchstaben
    - mindestens einer Zahl (0-9)
    - mindestens einem Sonderzeichen (!@#$%^&*(),.?":{}|<>)
    - mindestens 8 Zeichen
    bestehen.
- Drückt den Knopf "Speichern" in der unteren rechten Ecke.

### Account-Daten ändern
Ihr könnt euren Vor- und Nachnamen sowie eure E-Mail-Adresse ändern, indem ihr in den jeweiligen Feldern eure Daten eingebt und
auf den Knopf "Speichern" drückt.

## Tickets
Unter `domain.com/tickets` findet ihr alle Tickets. Die Filter unterstützen euch beim Suchen spezifischer Einträge.
Ihr werdet bemerken, dass Tickets mit Status "Fertig" hier nicht gelistet werden. Dies kann in den Status-Filtern geändert werden.

### Ticket Detail View
Sobald ihr auf ein Ticket klickt, werdet ihr in der sog. Ticket-Detail-View landen. Hier könnt ihr folgende Anpassungen vornehmen:

- Den Status des Tickets ändern
- Den Titel des Tickets ändern (der Original-Titel ist immer noch verfügbar)
- Labels an das Ticket anhängen und entfernen

Über die Ticket-Sidebar auf der linken Seite kommt ihr zu anderen Tickets, beziehungsweise auch zurück zur Gesamtübersicht.

> Der Titel unter dem das Ticket ursprünglich eingegangen ist, ist einsehbar indem man über den Titel mit der Maus hovered.

## Labels
Unter `domain.com/labels` könnt ihr Labels verwalten.

### Labels erstellen
Labels können unabhängig von Groß- und Kleinschreibung nur einmal existieren. Versucht ihr ein Label nochmal zu erstellen,
bzw. ein anderes zu aktualisieren, wird ein Error erscheinen der euch davor warnt, dass ein Label mit diesem 
Namen schon existiert.

### Labels bearbeiten
Labels können bearbeitet werden in dem man auf das Stift-Icon klickt. Hier kannst du den Namen anpassen, die Farbe ändern und 
auswählen, ob das Label öffentlich auf der Root-Seite (`domain.com`) zur Auswahl beim absenden eines Tickets stehen soll.
Es muss immer mindestens ein öffentliches Label geben, dass die Nutzer*innen beim Absenden des Formulars auswählen können.

## FAQ Verwalten
Wie ihr wahrscheinlich auf der Root-Seite (`domain.com`) gesehen habt, gibt es eine FAQ-Sektion unter dem Formular und eine
kleine Beschreibungsbox oben drüber. Beides kann unter `domain.com/faq` angepasst werden.

### About-Sektion 
Die Bearbeitung ist einfach über das Text-Feld möglich.

### FAQ
Neben der gleichen bearbeitungsweise wie bei den Labels, steht euch hier auch eine Drag and Drop Funktionalität zur Verfügung.
Dazu einfach eine FAQ aus der Tabelle an der linken Seite 'greifen' und verschieben.
> Derzeit werden Änderungen in der FAQ Reihenfolge sofort gültig
Den Wortlaut der Frage oder Antwort könnt ihr bearbeiten indem ihr auf das Stift-Icon klickt. Dort könnt ihr auch manuell
die Position in der Reihenfolge festlegen.

## Sonstiges

### Bugs
Solltet ihr als User einen Bug finden, würde es uns freuen, wenn ihr ihn unter https://github.com/Plebysnacc/kummerkasten/issues
reported.