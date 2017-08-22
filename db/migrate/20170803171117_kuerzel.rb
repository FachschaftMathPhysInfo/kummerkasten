class Kuerzel < ActiveRecord::Migration[5.1]
  def change
    add_column :courses, :abbreviation, :string
  end
end
