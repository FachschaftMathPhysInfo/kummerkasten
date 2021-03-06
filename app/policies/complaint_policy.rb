class ComplaintPolicy < ApplicationPolicy
  def index?
    isAdmin? or not user.nil?
  end
  def create?
    true
  end
  def create_with_course?(newone)
    #TODO: Hier checks einfügen um gegebenenfalls die Kommentierbarkeit einzuschränken.
    true
  end
  def show?
    if isAdmin?
      return true
    end
    return record.lecturers.include?(user)
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
      if not user.nil? and ( user!=:admin)
        if user.wantsreview?
          return user.complaints.where(approved:true,reviewed:true)
        else
          return user.complaints
        end
      end
      # TODO Admin überprüfung
      scope
    end
  end
end
