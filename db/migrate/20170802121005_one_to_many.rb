class OneToMany < ActiveRecord::Migration[5.1]
  def change
    add_reference :courses, :semester, foreign_key: true
    add_reference :courses, :coursetype, foreign_key: true
    add_reference :courses, :faculty, foreign_key: true
    add_reference :complaints, :course, foreign_key: true
  end
end
