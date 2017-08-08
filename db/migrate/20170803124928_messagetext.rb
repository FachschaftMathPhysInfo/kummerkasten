class Messagetext < ActiveRecord::Migration[5.1]
  def change
      change_column :complaints, :message, :text
    end
end
