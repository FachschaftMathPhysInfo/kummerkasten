class LecturerPolicy < ApplicationPolicy
  def update?
    user==record
  end
  class Scope < Scope
    def resolve
      scope
    end
  end
end
