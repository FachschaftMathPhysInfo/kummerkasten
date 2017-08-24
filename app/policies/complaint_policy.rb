class ComplaintPolicy < ApplicationPolicy
  def index?
    true
  end
  def create?
    true
  end
  def create_with_course?(newone)
    #TODO: Hier checks einfügen um gegebenenfalls die Kommentierbarkeit einzuschränken.
    true
  end
  def show?
    isAdmin? or record.lecturers.contains(user)
  end
  def update?
    isAdmin?
  end
  def destroy?
    isAdmin?
  end
  class Scope < Scope
    def resolve
      p scope
      p user
      if user.kind_of? Lecturer
        return user.complaints.where(approved:true,reviewed:true)
      end
      # TODO Admin überprüfung
      scope
    end
  end
end
