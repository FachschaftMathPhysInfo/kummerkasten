class AddAuthenticationTokenToLecturers < ActiveRecord::Migration[5.1]
  def change
    add_column :lecturers, :authentication_token, :string, limit: 30
    add_index :lecturers, :authentication_token, unique: true
  end
end
