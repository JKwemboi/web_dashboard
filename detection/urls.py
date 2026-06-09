from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('dashboard-data/', views.dashboard_data, name='dashboard_data'),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('profile/', views.profile, name='profile'),
    path('logout', views.logout, name='logout'),
#     path('video_feed', views.video_feed, name='video_feed'),
    path('map/', views.map_view, name='map'),
    path('robot_control_page/', views.robot_control_page,
         name='robot_control_page'),
    path('system-status/', views.system_status, name='system_status'),
    path('alerts/', views.alerts, name='alerts'),
    path('analytics/', views.analytics, name='analytics'),
    path('requirements/', views.requirements, name='requirements'),
    path('users/', views.users, name='users'),
    path('robot_api/', views.robot_control, name='robot_control'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('toggle-user/<int:user_id>/', views.toggle_user, name='toggle_user'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
    path('robot-location/', views.robot_location, name='robot_location'),
    path('detection-locations/', views.detection_locations,
         name='detection_locations'),
    path('settings/', views.settings_view, name='settings'),
    # API endpoints targeting background integrations
    path('api/telemetry/', views.receive_telemetry, name='receive_telemetry'),
    path('api/dashboard-data/', views.dashboard_data_view, name='dashboard_data'),
]
