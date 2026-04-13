import cv2
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages
from django.http import StreamingHttpResponse, JsonResponse
from detection.models import Detection
from django.db.models import Count
from datetime import datetime, timedelta
from .models import SystemSettings
from django.contrib.auth.decorators import login_required
import json


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
    cap = cv2.VideoCapture(0)  # or drone stream URL

    def generate():
        while True:
            success, frame = cap.read()
            if not success:
                break

            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    return StreamingHttpResponse(generate(),
                                 content_type='multipart/x-mixed-replace; boundary=frame')


@login_required
def profile(request):

    if request.method == "POST":
        user = request.user

        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.email = request.POST.get('email')

        user.save()
        return redirect('profile')

    return render(request, 'profile.html')


def settings(request):
    return render(request, 'settings.html', {'user': request.user})


def map_view(request):
    return render(request, 'map.html', {'user': request.user})


def drone_control(request):
    if request.method == "POST":
        data = json.loads(request.body)
        command = data.get("command")

        print("Drone Command:", command)

        return JsonResponse({"status": "ok"})


def drone_control_page(request):
    return render(request, 'drone_control.html', {'user': request.user})


def system_status(request):
    return render(request, 'system_status.html', {'user': request.user})


def alerts(request):
    return render(request, 'alerts.html', {'user': request.user})


def analytics(request):
    return render(request, 'analytics.html', {'user': request.user})


def users(request):
    users = User.objects.all()
    return render(request, 'users.html', {'users': users})


def users_page(request):
    users = User.objects.all()
    return render(request, 'users.html', {'users': users})


def toggle_user(request, user_id):
    user = User.objects.get(id=user_id)
    user.is_active = not user.is_active
    user.save()
    return redirect('users')


def delete_user(request, user_id):
    user = User.objects.get(id=user_id)
    user.delete()
    return redirect('users')


def admin_only(user):
    return user.is_superuser


def drone_location(request):
    # to be replaced with real drone GPS later
    data = {
        "lat": -1.2921,
        "lng": 36.8219
    }
    return JsonResponse(data)


def detection_locations(request):
    detections = Detection.objects.all().order_by('-timestamp')[:50]

    data = []
    for d in detections:
        data.append({
            "lat": d.latitude,
            "lng": d.longitude,
            "is_lion": d.is_lion,
            "time": d.timestamp.strftime("%H:%M:%S"),
            "confidence": getattr(d, 'confidence', 0)
        })

    return JsonResponse(data, safe=False)


def forgot_password(request):
    if request.method == "POST":
        email = request.POST.get("email")

        if User.objects.filter(email=email).exists():
            # 🔥 Here you will later send email
            messages.success(
                request, "Password reset link sent to your email.")
        else:
            messages.error(request, "Email not found.")

    return render(request, "forgotpassword.html")


def analytics(request):

    detections = Detection.objects.all()

    total = detections.count()
    lions = detections.filter(is_lion=True).count()
    normal = detections.filter(is_lion=False).count()

    # 📈 Trend (last 7 days)
    dates = []
    counts = []

    for i in range(6, -1, -1):
        day = datetime.now() - timedelta(days=i)
        count = detections.filter(
            is_lion=True,
            timestamp__date=day.date()
        ).count()

        dates.append(day.strftime("%a"))
        counts.append(count)

    # 📍 Hotspots
    zones = detections.values('location') \
                      .annotate(count=Count('id')) \
                      .order_by('-count')[:5]

    return render(request, 'analytics.html', {
        'total': total,
        'lions': lions,
        'normal': normal,
        'dates': dates,
        'counts': counts,
        'zones': zones
    })


def settings_view(request):
    settings = SystemSettings.objects.first()

    if request.method == "POST":
        settings.drone_name = request.POST.get('drone_name')
        settings.max_speed = request.POST.get('max_speed')
        settings.auto_patrol = request.POST.get('auto_patrol') == "on"

        settings.confidence = request.POST.get('confidence')
        settings.alert_enabled = request.POST.get('alert_enabled') == "on"
        settings.save_images = request.POST.get('save_images') == "on"

        settings.phone = request.POST.get('phone')
        settings.email = request.POST.get('email')

        settings.refresh_rate = request.POST.get('refresh_rate')

        settings.save()
        return redirect('settings')

    return render(request, 'setting.html', {'settings': settings})
