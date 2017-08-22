class Addunnotifieddue < ActiveRecord::Migration[5.1]
  def change
    add_column :unnotifiedcomplaints, :due, :datetime
  end
end
