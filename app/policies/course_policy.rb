class CoursePolicy < ApplicationPolicy
  def index?
    true
  end
  def show?
    true
  end
  def create?
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
