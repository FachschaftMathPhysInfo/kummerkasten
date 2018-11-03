# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_11_03_011641) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "complaints", force: :cascade do |t|
    t.boolean "approved"
    t.text "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "course_id"
    t.boolean "reviewed", default: false
    t.index ["course_id"], name: "index_complaints_on_course_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "semester_id"
    t.bigint "coursetype_id"
    t.bigint "faculty_id"
    t.string "abbreviation"
    t.integer "lsf_id"
    t.boolean "archived", default: false
    t.index ["coursetype_id"], name: "index_courses_on_coursetype_id"
    t.index ["faculty_id"], name: "index_courses_on_faculty_id"
    t.index ["semester_id"], name: "index_courses_on_semester_id"
  end

  create_table "coursetypes", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "faculties", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lsf_id"
  end

  create_table "hasreads", force: :cascade do |t|
    t.bigint "lecturer_id"
    t.bigint "complaint_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["complaint_id"], name: "index_hasreads_on_complaint_id"
    t.index ["lecturer_id"], name: "index_hasreads_on_lecturer_id"
  end

  create_table "lecturers", force: :cascade do |t|
    t.string "salutation"
    t.string "surname"
    t.string "givenname"
    t.integer "lsf_id"
    t.string "password"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "authentication_token", limit: 30
    t.string "notifications", default: "every"
    t.boolean "invite"
    t.boolean "wantsreview", default: true
    t.index ["authentication_token"], name: "index_lecturers_on_authentication_token", unique: true
    t.index ["email"], name: "index_lecturers_on_email", unique: true
    t.index ["reset_password_token"], name: "index_lecturers_on_reset_password_token", unique: true
  end

  create_table "lectures", force: :cascade do |t|
    t.bigint "lecturer_id"
    t.bigint "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_lectures_on_course_id"
    t.index ["lecturer_id"], name: "index_lectures_on_lecturer_id"
  end

  create_table "queue_classic_jobs", force: :cascade do |t|
    t.text "q_name", null: false
    t.text "method", null: false
    t.json "args", null: false
    t.datetime "locked_at"
    t.integer "locked_by"
    t.datetime "created_at", default: -> { "now()" }
    t.datetime "scheduled_at", default: -> { "now()" }
    t.index ["q_name", "id"], name: "idx_qc_on_name_only_unlocked", where: "(locked_at IS NULL)"
    t.index ["scheduled_at", "id"], name: "idx_qc_on_scheduled_at_only_unlocked", where: "(locked_at IS NULL)"
  end

  create_table "semesters", force: :cascade do |t|
    t.string "name"
    t.date "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lsf_id"
    t.boolean "archived", default: false
  end

  create_table "unnotifiedcomplaints", force: :cascade do |t|
    t.bigint "lecturer_id"
    t.bigint "complaint_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "due"
    t.index ["complaint_id"], name: "index_unnotifiedcomplaints_on_complaint_id"
    t.index ["lecturer_id"], name: "index_unnotifiedcomplaints_on_lecturer_id"
  end

  add_foreign_key "complaints", "courses"
  add_foreign_key "courses", "coursetypes"
  add_foreign_key "courses", "faculties"
  add_foreign_key "courses", "semesters"
  add_foreign_key "hasreads", "complaints"
  add_foreign_key "hasreads", "lecturers"
  add_foreign_key "lectures", "courses"
  add_foreign_key "lectures", "lecturers"
  add_foreign_key "unnotifiedcomplaints", "complaints"
  add_foreign_key "unnotifiedcomplaints", "lecturers"
end
