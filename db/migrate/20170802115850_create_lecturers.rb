class CreateLecturers < ActiveRecord::Migration[5.1]
  def change
    create_table :lecturers do |t|
      t.string :email
      t.string :salutation
      t.string :surname
      t.string :givenname

      t.timestamps
    end
  end
end
