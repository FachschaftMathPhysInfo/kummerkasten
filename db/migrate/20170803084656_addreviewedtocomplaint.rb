class Addreviewedtocomplaint < ActiveRecord::Migration[5.1]
  def change
    add_column :complaints, :reviewed, :boolean
    change_column_default :complaints, :reviewed, false
  end
end
