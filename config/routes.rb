Rails.application.routes.draw do
  mount_ember_app :admin, to: "/admin/"
  scope '/admin' do
    jsonapi_resources :complaints
    jsonapi_resources :courses
    jsonapi_resources :coursetypes
    jsonapi_resources :faculties
    jsonapi_resources :hasreads
    get '/lecturers/reset', to: 'lecturers#reset'
    jsonapi_resources :lecturers
    jsonapi_resources :lectures
    jsonapi_resources :semesters
  end
  mount_ember_app :frontend, to: "/"
  devise_for :lecturers, controllers: { sessions: 'sessions' }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  jsonapi_resources :complaints
  jsonapi_resources :courses
  jsonapi_resources :coursetypes
  jsonapi_resources :faculties
  jsonapi_resources :hasreads
  get '/lecturers/me', to: 'lecturers#me'
  patch '/lecturers/update_password', to: 'lecturers#update_password'
  jsonapi_resources :lecturers
  jsonapi_resources :lectures
  jsonapi_resources :semesters

end
