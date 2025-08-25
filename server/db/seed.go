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
	}

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
		}}
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
		{Question: "Was ist der Kummerkasten?", Answer: "Eine anonyme Anlaufstelle für Kummer im und ums Studium."},
		{Question: "Wofür ist der Kummerkasten?", Answer: "Zu schwere Zettel, Erschwerte Kommunikation mit einer/m Dozierenden, Zu hoher Lernaufwand in einer Veranstaltung, Probleme mit der Fachschaft,..."},
		{Question: "Wer ist der Kummerkasten?", Answer: "Eine kleine Teilmenge der Fachschaft MathPhysInfo."},
		{Question: "Wofür ist der Kummerkasten nicht da?", Answer: "Persönliche und mentale Probleme im Studium, Stress mit Kommilitonen"},
		{Question: "Wie werden meine Daten verarbeitet?", Answer: "Dein Feedback landet vollkommen anonym bei uns im System, und wir kümmern uns in unserem Team darum dieses auszuwerten und mit allen benötigten Parteien zu bereden."},
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
