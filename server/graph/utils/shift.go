package utils

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/FachschaftMathPhysInfo/kummerkasten/graph/model"
	"github.com/uptrace/bun"
)

func Indices(ctx context.Context, db *bun.DB, newIndex int32, id string) error {
	var qaps []*model.QuestionAnswerPair

	if err := db.NewSelect().Model(&qaps).Where("id = ?", id).Scan(ctx); err != nil {
		slog.Error("Failed to get qap", "id", id, "error", err)
		return err
	}

	if len(qaps) == 0 {
		slog.Error("QuestionAnswerPair not found", "id", id)
		return fmt.Errorf("QuestionAnswerPair with id %v not found", id)
	}

	qap := qaps[0]

	if qap.Position == newIndex {
		return nil
	} else if qap.Position > newIndex {
		if err := shiftIndecesUp(ctx, db, newIndex, qap); err != nil {
			return err
		}
	} else {
		if err := shiftIndecesDown(ctx, db, newIndex, qap); err != nil {
			return err
		}
	}

	return nil
}

func shiftIndecesUp(ctx context.Context, db *bun.DB, newIndex int32, qap *model.QuestionAnswerPair) error {

	amountQaps, err := db.NewSelect().Model((*model.QuestionAnswerPair)(nil)).Count(ctx)
	if err != nil {
		slog.Error("Failed to get amountQaps", "error", err)
		return err
	}

	if _, err := db.NewUpdate().Model((*model.QuestionAnswerPair)(nil)).
		Where("position >= ?", newIndex).
		Where("position <= ?", qap.Position).
		Set(`"position" = "position" + ?`, amountQaps).
		Exec(ctx); err != nil {
		slog.Error("Failed to set update offset", "error", err)
		return err
	}

	if _, err := db.NewUpdate().Model((*model.QuestionAnswerPair)(nil)).
		Where("id = ?", qap.ID).
		Set("position = ?", newIndex).
		Exec(ctx); err != nil {
		slog.Error("Failed to set new index", "error", err)
		return err
	}

	if _, err := db.NewUpdate().Model((*model.QuestionAnswerPair)(nil)).
		Where("position > ?", amountQaps-1).
		Set(`"position" = "position" - ?`, amountQaps-1).
		Exec(ctx); err != nil {
		slog.Error("Failed to reset update offset", "error", err)
		return err
	}

	return nil
}

func shiftIndecesDown(ctx context.Context, db *bun.DB, newIndex int32, qap *model.QuestionAnswerPair) error {
	amountQaps, err := db.NewSelect().Model((*model.QuestionAnswerPair)(nil)).Count(ctx)
	if err != nil {
		slog.Error("Failed to get amountQaps", "error", err)
		return err
	}

	if _, err := db.NewUpdate().Model((*model.QuestionAnswerPair)(nil)).
		Where("position <= ?", newIndex).
		Where("position >= ?", qap.Position).
		Set(`"position" = "position" + ?`, amountQaps).
		Exec(ctx); err != nil {
		slog.Error("Failed to set update offset", "error", err)
		return err
	}

	if _, err := db.NewUpdate().Model((*model.QuestionAnswerPair)(nil)).
		Where("id = ?", qap.ID).
		Set("position = ?", newIndex).
		Exec(ctx); err != nil {
		slog.Error("Failed to set new index", "error", err)
		return err
	}

	if _, err := db.NewUpdate().Model((*model.QuestionAnswerPair)(nil)).
		Where("position > ?", amountQaps-1).
		Set(`"position" = "position" - ?`, amountQaps+1).
		Exec(ctx); err != nil {
		slog.Error("Failed to reset update offset", "error", err)
		return err
	}

	return nil
}
