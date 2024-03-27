from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_room, name='chat_room'),
    path('send-message/', views.send_message, name='send_message'),
]
