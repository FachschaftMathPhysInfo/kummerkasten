class LecturerPolicy < ApplicationPolicy
  def update?
    p @user
    p "@",@record
    @user==@record or isAdmin?
  end
  def index?
    isAdmin?
  end
  def create?
   isAdmin?
  end
  def show?
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
