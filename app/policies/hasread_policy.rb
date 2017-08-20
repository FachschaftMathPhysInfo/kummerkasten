class HasreadPolicy < ApplicationPolicy
  def create?
    not user.nil?
  end
  def create_with_lecturer?(lecturer)
    lecturer==user
  end
  def create_with_complaint?(complaint)
    true
  end
  class Scope < Scope
    def resolve
      scope
    end
  end
end
