from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('profile/', views.profile, name='profile'),
    path('logout', views.logout, name='logout'),
    path('video_feed', views.video_feed, name='video_feed'),
    path('map/', views.map_view, name='map'),
    path('drone_control_page/', views.drone_control_page,
         name='drone_control_page'),
    path('system-status/', views.system_status, name='system_status'),
    path('alerts/', views.alerts, name='alerts'),
    path('analytics/', views.analytics, name='analytics'),
    path('requirements/', views.requirements, name='requirements'),
    path('users/', views.users, name='users'),
    path('drone_api/', views.drone_control, name='drone_control'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('toggle-user/<int:user_id>/', views.toggle_user, name='toggle_user'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
    path('drone-location/', views.drone_location, name='drone_location'),
    path('detection-locations/', views.detection_locations,
         name='detection_locations'),
    path('settings/', views.settings_view, name='settings'),
]
