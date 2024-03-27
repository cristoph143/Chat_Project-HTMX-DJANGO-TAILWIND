from django.apps import AppConfig


class ChatappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chatapp'
    label = 'chatapp_unique'  # Optionally set a unique label if necessary
