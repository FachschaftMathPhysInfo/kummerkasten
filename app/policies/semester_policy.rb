class SemesterPolicy < ApplicationPolicy
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
      if not user.nil? and (user!= :admin)
        scope.where("archived=false OR lecturer_id=#{user.id}")
      elsif user==:admin
        Semester.all
      else
        scope.where(archived:false)
      end
    end
  end
end
