Rails.application.routes.draw do
  mount_ember_app :frontend, to: "/"
  devise_for :lecturers, controllers: { sessions: 'sessions' }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  jsonapi_resources :complaints
  jsonapi_resources :courses
  jsonapi_resources :coursetypes
  jsonapi_resources :faculties
  jsonapi_resources :has_reads
  jsonapi_resources :lecturers
  jsonapi_resources :lectures
  jsonapi_resources :semesters

end
