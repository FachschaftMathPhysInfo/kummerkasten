class LecturerPolicy < ApplicationPolicy
  def update?
    user==record
  end
  def create?
   isAdmin?
  end
  def show?
    isAdmin?
  end
  def update?
    isAdmin?
  end
  def destroy?
    isAdmin?
  end
  class Scope < Scope
    def resolve
      scope
    end
  end
end
