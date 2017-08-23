class CoursetypePolicy < ApplicationPolicy
  def create?
   isAdmin?
  end
  def index?
   true
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
