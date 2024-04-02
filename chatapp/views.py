from django.shortcuts import render, redirect
from .models import Message
from django.http import HttpResponse
from django.core.paginator import Paginator

# def chat_room(request):
#     messages = Message.objects.all()
#     return render(request, 'chatapp/chat_room.html', {'messages': messages})

def chat_room(request):
    messages_list = Message.objects.all().order_by('-id')  # Assuming you have an 'id' field
    paginator = Paginator(messages_list, 14) 
    messages = paginator.get_page(1)
    last_message_id = messages[-1].id if messages else None
    return render(request, 'chatapp/chat_room.html', {
        'messages': messages,
        'last_message_id': last_message_id,
    })


def load_more_messages(request, last_message_id):
    older_messages = Message.objects.filter(id__lt=last_message_id).order_by('-id')[:10]
    is_all_loaded = not Message.objects.filter(id__lt=older_messages.last().id).exists() if older_messages else True

    # Return both messages and the is_all_loaded flag, possibly via JSON
    return render(request, 'chatapp/_messages.html', {
        'messages': older_messages,
        'is_all_loaded': is_all_loaded,
    })


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
