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
    true
  end
  class Scope < Scope
    def resolve
      p scope
      p user
      user.complaints
    end
  end
end