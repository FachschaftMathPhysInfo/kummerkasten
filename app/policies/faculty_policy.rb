class FacultyPolicy < ApplicationPolicy
  def index?
    true
  end
  def create?
   isAdmin?
  end
  def show?
    true
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
