package models

import "github.com/uptrace/bun"

type QuestionAnswerPair struct {
	bun.BaseModel `bun:"table:question_answer_pairs"`

	ID       string `bun:",pk,default:gen_random_UUID(),type:uuid"`
	Question string `bun:",unique,notnull"`
	Answer   string `bun:",notnull"`
}
