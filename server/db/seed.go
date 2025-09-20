package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Plebysnacc/kummerkasten/auth"
	"github.com/Plebysnacc/kummerkasten/graph/model"
	"github.com/Plebysnacc/kummerkasten/models"
	"github.com/Plebysnacc/kummerkasten/utils"
	"github.com/uptrace/bun"
)

func SeedData(ctx context.Context, db *bun.DB) error {
	if err := createAdminUser(ctx, db); err != nil {
		return err
	}
	if err := createSettings(ctx, db); err != nil {
		return err
	}

	if os.Getenv("ENV") != "DEV" {
		fmt.Printf("Skipping test data seeding (ENV != DEV)")
		return nil
	}

	if err := seedTestUsers(ctx, db); err != nil {
		return err
	}

	labels := []*models.Label{
		{
			Name:      "dozent*in",
			Color:     "#474770",
			FormLabel: true,
		},
		{
			Name:  "prof. mathe",
			Color: "#476870",
		},
		{
			Name:      "veranstaltung",
			Color:     "#47704e",
			FormLabel: true,
		},
		{
			Name:  "lineare algebra",
			Color: "#487047",
		},
		{
			Name:      "fachschaft",
			Color:     "#477068",
			FormLabel: true,
		},
		{
			Name:  "gremienwahlen",
			Color: "#706047",
		},
		{
			Name:      "sonstiges",
			Color:     "#6a4770",
			FormLabel: true,
		},
		{
			Name:  "soziales",
			Color: "#6a4770",
		},
		{
			Name:  "mathematikon",
			Color: "#797596",
		},
		{
			Name:  "PAP",
			Color: "#A1869E",
		},
		{
			Name:  "Vorkurs",
			Color: "#684A52",
		},
		{
			Name:  "Bachelorarbeit",
			Color: "#87A0B2",
		},
		{
			Name:  "Seminar",
			Color: "#A4BEF3",
		},
		{
			Name:  "Mittagspause",
			Color: "#4E8098",
		},
		{
			Name:  "Laptop",
			Color: "#B6CB9E",
		}}

	if err := insertData(ctx, db, (*models.Label)(nil), labels, "Labels"); err != nil {
		return err
	}

	labelMap := map[string]*models.Label{}
	for _, label := range labels {
		labelMap[label.Name] = label
	}

	tickets := []*models.Ticket{
		{
			Title:         "Lineare Algebra",
			OriginalTitle: "LA1",
			Text:          "Ich komme mit der Mathe nicht klar :(",
			Note:          "",
			State:         model.TicketStateNew,
			Labels:        []*models.Label{labelMap["lineare algebra"], labelMap["prof. mathe"]},
			CreatedAt:     time.Now(),
			LastModified:  time.Now(),
		},
		{
			Title:         "Praktikumsplatz",
			OriginalTitle: "AP",
			Text:          "Hilfe! Ich finde keine Dozent*innen die mir einen Pratkikumsplatz anbieten.",
			Note:          "Vorschlag: Weiterführende Vorlesungen hören, beim DKFZ und ZITI nachfragen.",
			State:         model.TicketStateOpen,
			Labels:        []*models.Label{labelMap["sonstiges"], labelMap["veranstaltung"]},
			CreatedAt:     time.Now(),
			LastModified:  time.Now(),
		},
		{
			Title:         "alles doof",
			OriginalTitle: "scheiße",
			Text:          "ich will nicht mehr studieren wo exmatrikulationsantrag",
			Note:          "Kann geschlossen werden.",
			State:         model.TicketStateOpen,
			Labels:        []*models.Label{labelMap["sonstiges"], labelMap["soziales"]},
			CreatedAt:     time.Now(),
			LastModified:  time.Now(),
		},
		{
			Title:         "miau",
			OriginalTitle: "miau",
			Text:          "woof",
			Note:          "Spam",
			State:         model.TicketStateClosed,
			Labels:        []*models.Label{labelMap["soziales"], labelMap["fachschaft"]},
			CreatedAt:     time.Now(),
			LastModified:  time.Now(),
		},
		{
			Title:         "PAP",
			OriginalTitle: "PAP",
			Text:          "Das PAP geht mir zu lange",
			Note:          "",
			State:         model.TicketStateOpen,
			Labels:        []*models.Label{labelMap["veranstaltung"], labelMap["PAP"]},
			CreatedAt:     time.Now().AddDate(0, -1, -3),
			LastModified:  time.Now(),
		},
		{
			Title:         "Klausurvorbereitung",
			OriginalTitle: "Analysis II",
			Text:          "Ich brauche Hilfe bei den Übungsaufgaben.",
			Note:          "",
			State:         model.TicketStateNew,
			Labels:        []*models.Label{labelMap["prof. mathe"], labelMap["veranstaltung"], labelMap["mathematikon"]},
			CreatedAt:     time.Now().AddDate(0, -1, -3),
			LastModified:  time.Now().AddDate(0, -1, -1),
		},
		{
			Title:         "Bibliothek",
			OriginalTitle: "Bib",
			Text:          "Die Bibliothek ist immer voll!",
			Note:          "Weitergeben an Uni-Verwaltung.",
			State:         model.TicketStateOpen,
			Labels:        []*models.Label{labelMap["sonstiges"], labelMap["veranstaltung"]},
			CreatedAt:     time.Now().AddDate(0, -2, 0),
			LastModified:  time.Now().AddDate(0, -1, 20),
		},
		{
			Title:         "Tutorium",
			OriginalTitle: "IPK Tut",
			Text:          "Das Tutorium für Programmieren fällt oft aus.",
			Note:          "Nachfragen bei Tutor*innen.",
			State:         model.TicketStateOpen,
			Labels:        []*models.Label{labelMap["Laptop"], labelMap["veranstaltung"]},
			CreatedAt:     time.Now().AddDate(-2, 0, -10),
			LastModified:  time.Now().AddDate(0, 0, -5),
		},
		{
			Title:         "Mentoring",
			OriginalTitle: "Buddys??",
			Text:          "Ich verstehe das Buddy-Programm nicht.",
			Note:          "An Verantwortliche weiterleiten.",
			State:         model.TicketStateNew,
			Labels:        []*models.Label{labelMap["soziales"], labelMap["Vorkurs"]},
			CreatedAt:     time.Now().AddDate(-3, 0, -10),
			LastModified:  time.Now().AddDate(-3, 0, -10),
		},
		{
			Title:         "Mensa",
			OriginalTitle: "Essen",
			Text:          "Das Essen in der Mensa ist zu teuer.",
			Note:          "Valid",
			State:         model.TicketStateClosed,
			Labels:        []*models.Label{labelMap["sonstiges"], labelMap["Mittagspause"]},
			CreatedAt:     time.Now().AddDate(-1, 0, -10),
			LastModified:  time.Now().AddDate(0, -2, -10),
		},
		{
			Title:         "Ich bin ein sehr sehr langer langer Titel (hoffentlich sehr lang)",
			OriginalTitle: "jaja",
			Text:          "das voll smart.",
			Note:          "Valid",
			State:         model.TicketStateNew,
			Labels:        []*models.Label{labelMap["sonstiges"], labelMap["Mittagspause"]},
			CreatedAt:     time.Now().AddDate(-1, -8, -10),
			LastModified:  time.Now().AddDate(0, -2, -1),
		},
		{
			Title:         "Kurzer Titel!",
			OriginalTitle: "jaja",
			Text: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
            		        montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu,
            		        pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
                            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
       		                venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer
       		                tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend
            		        tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
            		        Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra
                            nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies
       		                nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.
       		                Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet
          		            adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar,
            		        hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien
                            ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros
      		                faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales
       		                sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
           		            quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus
            		        quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui.
                            Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in
            		        faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi
            		        consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget,
            		        imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante
            		        arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing.
            		        Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat
            		        pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam
            		        nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus.
            		        Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis.
            		        Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non,
            		        auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod
            		        vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa.
            		        Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan
            		        cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            		        posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod
            		        orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit.
            		        Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum
            		        fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis.
            		        Aenean posuere, tor`,
			Note:         "Valid",
			State:        model.TicketStateNew,
			Labels:       []*models.Label{labelMap["PAP"], labelMap["fachschaft"]},
			CreatedAt:    time.Now().AddDate(0, -8, -10),
			LastModified: time.Now().AddDate(0, -2, -1),
		},
		{
			Title:         "Sehr viele Labels",
			OriginalTitle: "jaja",
			Text:          "das voll smart.",
			Note:          "Valid",
			State:         model.TicketStateNew,
			Labels: []*models.Label{labelMap["sonstiges"], labelMap["Mittagspause"],
				labelMap["dozent*in"], labelMap["prof. mathe"],
				labelMap["lineare algebra"], labelMap["fachschaft"],
				labelMap["gremienwahlen"], labelMap["soziales"],
				labelMap["mathematikon"], labelMap["PAP"], labelMap["Vorkurs"],
				labelMap["Bachelorarbeit"], labelMap["Seminar"],
				labelMap["Laptop"]},
			CreatedAt:    time.Now().AddDate(0, -4, -10),
			LastModified: time.Now().AddDate(0, -2, -1),
		},
		{
			Title:         "Ich bin ein sehr altes Ticket",
			OriginalTitle: "jaja",
			Text:          "das voll smart.",
			Note:          "Valid",
			State:         model.TicketStateClosed,
			Labels:        []*models.Label{labelMap["sonstiges"], labelMap["mathematikon"]},
			CreatedAt:     time.Now().AddDate(-10, -8, -10),
			LastModified:  time.Now().AddDate(-9, -2, -1),
		},
	}
	if err := insertData(ctx, db, (*models.Ticket)(nil), tickets, "Tickets"); err != nil {
		return err
	}

	var labelLinks []*models.LabelsToTickets

	for _, ticket := range tickets {
		for _, label := range ticket.Labels {
			labelLinks = append(labelLinks, &models.LabelsToTickets{
				TicketID: ticket.ID,
				LabelID:  label.ID,
			})
		}
	}

	if err := insertData(ctx, db, (*models.LabelsToTickets)(nil), labelLinks, "Label To Tickets"); err != nil {
		return err
	}

	settings := []*models.Setting{
		{Key: "logo-url", Value: "http://localhost:8080/fs-logo.png"},
		{Key: "homepage-url", Value: "https://mathphys.info"},
		{Key: "copyright-notice", Value: "Copyright © 2024, Fachschaft MathPhysInfo. All rights reserved."},
		{Key: "email-greeting", Value: "Hey"},
		{Key: "email-signature", Value: "Dein"},
		{Key: "email-name", Value: "Kummerkasten"},
		{Key: "auth-standard-enabled", Value: "1"},
		{Key: "auth-sso-oidc-enabled", Value: "1"},
		{Key: "auth-sso-oidc-name", Value: "Fachschaftslogin"},
	}

	if err := insertData(ctx, db, (*models.Setting)(nil), settings, "Settings"); err != nil {
		return err
	}

	qAPs := []*models.QuestionAnswerPair{
		{Question: "Was ist der Kummerkasten?", Answer: "Eine anonyme Anlaufstelle für Kummer im und ums Studium.", Order: 0},
		{Question: "Wofür ist der Kummerkasten?", Answer: "Zu schwere Zettel, Erschwerte Kommunikation mit einer/m Dozierenden, Zu hoher Lernaufwand in einer Veranstaltung, Probleme mit der Fachschaft,...", Order: 1},
		{Question: "Wer ist der Kummerkasten?", Answer: "Eine kleine Teilmenge der Fachschaft MathPhysInfo.", Order: 2},
		{Question: "Wofür ist der Kummerkasten nicht da?", Answer: "Persönliche und mentale Probleme im Studium, Stress mit Kommilitonen", Order: 3},
		{Question: "Wie werden meine Daten verarbeitet?", Answer: "Dein Feedback landet vollkommen anonym bei uns im System, und wir kümmern uns in unserem Team darum dieses auszuwerten und mit allen benötigten Parteien zu bereden.", Order: 4},
	}

	if err := insertData(ctx, db, (*models.QuestionAnswerPair)(nil), qAPs, "Question Answer Pairs"); err != nil {
		return err
	}

	return nil
}

func createAdminUser(ctx context.Context, db *bun.DB) error {
	var err error

	mail := os.Getenv("ADMIN_MAIL")
	if mail == "" {
		mail = "admin@kummer.kasten"
	}

	exists, err := db.NewSelect().
		Model((*models.User)(nil)).
		Where("mail = ?", mail).
		Exists(ctx)
	if err != nil {
		return err
	}
	if exists {
		log.Printf("Admin user with email %s already exists, skipping creation\n", mail)
		return nil
	}

	password := "admin"
	if os.Getenv("ENV") == "PROD" {
		if os.Getenv("ADMIN_PASSWORD") != "" {
			password = os.Getenv("ADMIN_PASSWORD")
		} else {
			password, err = utils.RandString(32)
			if err != nil {
				return err
			}
		}
	}
	hash, err := auth.HashPassword(password)
	if err != nil {
		return err
	}

	admin := &models.User{
		Mail:         mail,
		Firstname:    "Admin",
		Lastname:     "Kummerkasten",
		Password:     hash,
		Role:         model.UserRoleAdmin,
		CreatedAt:    time.Now(),
		LastModified: time.Now(),
	}

	if _, err := db.NewInsert().Model(admin).Exec(ctx); err != nil {
		return fmt.Errorf("failed to create admin user: %w", err)
	}

	log.Printf("Admin user created with email: %s", mail)
	log.Printf("Admin user created with password: %s", password)
	return nil
}

func createSettings(ctx context.Context, db *bun.DB) error {
	const contactLinkKey = "FOOTER_CONTACT_LINK"
	const legalNoticeKey = "FOOTER_LEGAL_NOTICE_LINK"
	const aboutSectionTextKey = "ABOUT_SECTION_TEXT"

	settings := []*models.Setting{
		{Key: contactLinkKey, Value: "https://mathphys.stura.uni-heidelberg.de/kontakt/"},
		{Key: legalNoticeKey, Value: "https://mathphys.stura.uni-heidelberg.de/"},
		{Key: aboutSectionTextKey, Value: "Der Kummerkasten ist das Feedbacksammlungssystem der Fachschaft. Er hilft bei Problemen in Vorlesungen (und bei Problemen mit anderen Institutionen, denen Studenten im Unialltag begegnen). \nDen Digitalen Kummerkasten findest du hier. Der analoge Kummerkasten steht im Gang vor dem Fachschaftsraum (bei den Flyern vor der Teeküche)."},
	}

	keys := []string{contactLinkKey, legalNoticeKey, aboutSectionTextKey}
	existing := make([]*models.Setting, 0)

	if err := db.NewSelect().
		Model(&existing).
		Where("key IN (?)", bun.In(keys)).
		Scan(ctx); err != nil {
		return fmt.Errorf("failed to fetch settings: %w", err)
	}

	existingKeys := make(map[string]bool)
	for _, s := range existing {
		existingKeys[s.Key] = true
	}

	toInsert := make([]*models.Setting, 0)
	for _, s := range settings {
		if !existingKeys[s.Key] {
			toInsert = append(toInsert, s)
		} else {
			log.Printf("Skipping seeding for existing setting: %s", s.Key)
		}
	}

	if len(toInsert) > 0 {
		if _, err := db.NewInsert().Model(&toInsert).Exec(ctx); err != nil {
			return fmt.Errorf("failed to insert settings: %w", err)
		}
	}

	return nil
}

func seedTestUsers(ctx context.Context, db *bun.DB) error {
	testEmails := []string{
		"cheffe@kummerkasten.local",
		"root@kummerkasten.local",
		"fsles1@kummerkasten.local",
		"fsles2@kummerkasten.local",
		"fsles3@kummerkasten.local",
		"admin@cypress.kummer",
	}

	for _, email := range testEmails {
		exists, err := db.NewSelect().
			Model((*models.User)(nil)).
			Where("mail = ?", email).
			Exists(ctx)
		if err != nil {
			return err
		}
		if exists {
			log.Printf("Test users already exist, skipping test user seeding")
			return nil
		}
	}

	users := []*models.User{
		{
			Mail:         "cheffe@kummerkasten.local",
			Firstname:    "Chef",
			Lastname:     "Fe",
			Password:     "cheffe",
			Role:         model.UserRoleAdmin,
			CreatedAt:    time.Now(),
			LastModified: time.Now(),
		},
		{
			Mail:         "root@kummerkasten.local",
			Firstname:    "Root",
			Lastname:     "Ruth",
			Password:     "root",
			Role:         model.UserRoleAdmin,
			CreatedAt:    time.Now(),
			LastModified: time.Now(),
		},
		{
			Mail:         "fsles1@kummerkasten.local",
			Firstname:    "Fachschaft",
			Lastname:     "Eins",
			Password:     "fachschaft",
			Role:         model.UserRoleUser,
			CreatedAt:    time.Now(),
			LastModified: time.Now(),
		},
		{
			Mail:         "fsles2@kummerkasten.local",
			Firstname:    "Fachschaft",
			Lastname:     "Zwei",
			Password:     "fachschaft",
			Role:         model.UserRoleUser,
			CreatedAt:    time.Now(),
			LastModified: time.Now(),
		},
		{
			Mail:         "fsles3@kummerkasten.local",
			Firstname:    "Fachschaft",
			Lastname:     "Drei",
			Password:     "fachschaft",
			Role:         model.UserRoleUser,
			CreatedAt:    time.Now(),
			LastModified: time.Now(),
		},
		{
			Mail:         "admin@cypress.kummer",
			Firstname:    "Admin",
			Lastname:     "Cypress",
			Password:     "OriginalPassword1!",
			Role:         model.UserRoleAdmin,
			CreatedAt:    time.Now(),
			LastModified: time.Now(),
		},
	}

	for _, user := range users {
		hash, err := auth.HashPassword(user.Password)
		if err != nil {
			return fmt.Errorf("failed to hash password for user %s: %w", user.Mail, err)
		}
		user.Password = hash
	}

	if _, err := db.NewInsert().Model(&users).Exec(ctx); err != nil {
		return fmt.Errorf("failed to insert test users: %w", err)
	}

	log.Print("Test users seeded successfully")
	return nil
}

func insertData[T any](ctx context.Context, db *bun.DB, model T, data []T, description string) error {
	count, err := db.NewSelect().Model(model).Count(ctx)
	if err != nil {
		return err
	}

	if count == 0 {
		if _, err := db.NewInsert().Model(&data).Exec(ctx); err != nil {
			return fmt.Errorf("%s: %s", description, err)
		}
		log.Printf("%s seeded successfully\n", description)
	}
	return nil
}
