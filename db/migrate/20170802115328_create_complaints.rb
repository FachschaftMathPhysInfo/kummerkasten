class CreateComplaints < ActiveRecord::Migration[5.1]
  def change
    create_table :complaints do |t|
      t.boolean :approved
      t.string :title
      t.string :message

      t.timestamps
    end
  end
end
