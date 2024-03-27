from django.shortcuts import render, redirect
from .models import Message
from django.http import HttpResponse

def chat_room(request):
    messages = Message.objects.all()
    return render(request, 'chatapp/chat_room.html', {'messages': messages})

def send_message(request):
    if request.method == 'POST':
        message_content = request.POST.get('message')
        if message_content:
            Message.objects.create(author="Anonymous", content=message_content)
        messages = Message.objects.all()
        # Render only the messages part of the page
        return render(request, 'chatapp/_messages.html', {'messages': messages})
    return redirect('chat_room')


def home(request):
    return HttpResponse('Welcome to the Chat Application! <a href="/chat/">Enter Chat</a>')
