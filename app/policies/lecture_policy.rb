class LecturePolicy < ApplicationPolicy
  def create?
   isAdmin?
  end
  def update?
    isAdmin?
  end
  def destroy?
    isAdmin?
  end
  def show?
    isAdmin?
  end
  class Scope < Scope
    def resolve
      scope
    end
  end
end
