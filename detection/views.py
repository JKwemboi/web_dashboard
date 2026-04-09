from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import StreamingHttpResponse
from detection.models import Detection
# from .camera import gen_frames
from . import views


def dashboard(request):
    # require login to access dashboard
    if not request.user.is_authenticated:
        return redirect('login')
    else:
        detections = Detection.objects.all().order_by('-timestamp')[:6]
        return render(request, 'index.html', {'user': request.user, 'detections': detections})


def login(request):
    if request.method == 'POST':
        username = request.POST['_username']
        password = request.POST['_password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid Credentials')
            return redirect('login')
    else:
        return render(request, 'login.html')


def signup(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password == confirm_password:
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists')
                return redirect('signup')
            elif User.objects.filter(email=email).exists():
                messages.error(request, 'Email already exists')
                return redirect('signup')
            else:
                user = User.objects.create_user(
                    username=username, email=email, password=password, first_name=first_name, last_name=last_name)
                user.save()
                messages.success(request, 'User created successfully')
                return redirect('login')
        else:
            messages.error(request, 'Passwords do not match')
            return redirect('signup')
    else:
        return render(request, 'signup.html')


def logout(request):
    auth.logout(request)
    return redirect('login')


def video_feed(request):
    return StreamingHttpResponse(gen_frames(),
                                 content_type='multipart/x-mixed-replace; boundary=frame')


def profile(request):
    return render(request, 'profile.html', {'user': request.user})


def settings(request):
    return render(request, 'settings.html', {'user': request.user})


def map_view(request):
    return render(request, 'map.html', {'user': request.user})


def drone_control(request):
    return render(request, 'drone_control.html', {'user': request.user})


def system_status(request):
    return render(request, 'system_status.html', {'user': request.user})


def alerts(request):
    return render(request, 'alerts.html', {'user': request.user})


def analytics(request):
    return render(request, 'analytics.html', {'user': request.user})


def users(request):
    return render(request, 'users.html', {'user': request.user})
