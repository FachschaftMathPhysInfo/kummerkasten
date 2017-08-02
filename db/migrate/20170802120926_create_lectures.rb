class CreateLectures < ActiveRecord::Migration[5.1]
  def change
    create_table :lectures do |t|
      t.references :lecturer, foreign_key: true
      t.references :course, foreign_key: true

      t.timestamps
    end
  end
end
