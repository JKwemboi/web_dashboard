from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('profile', views.profile, name='profile'),
    path('settings', views.settings, name='settings'),
    path('logout', views.logout, name='logout'),
    path('video_feed', views.video_feed, name='video_feed'),
    path('map/', views.map_view, name='map'),
    path('drone_control_page/', views.drone_control_page,
         name='drone_control_page'),
    path('system-status/', views.system_status, name='system_status'),
    path('alerts/', views.alerts, name='alerts'),
    path('analytics/', views.analytics, name='analytics'),
    path('users/', views.users, name='users'),
    path('drone_api/', views.drone_control, name='drone_control'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
]
