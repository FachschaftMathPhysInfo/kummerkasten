class CreateEventtypes < ActiveRecord::Migration[5.1]
  def change
    create_table :coursetypes do |t|
      t.string :name

      t.timestamps
    end
  end
end
