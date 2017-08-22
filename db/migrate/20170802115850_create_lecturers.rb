class CreateLecturers < ActiveRecord::Migration[5.1]
  def change
    create_table :lecturers do |t|
      t.string :salutation
      t.string :surname
      t.string :givenname
    end
  end
end
