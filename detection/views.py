import cv2
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import StreamingHttpResponse, JsonResponse
from detection.models import Detection
from django.db.models import Count
from datetime import datetime, timedelta
from .models import SystemSettings
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
import json


def dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login')

    detection_qs = Detection.objects.all().order_by('-timestamp')
    detections = detection_qs[:6]

    return render(request, 'index.html', {
        'user': request.user,
        'detections': detections,
        'total_detections': detection_qs.count(),
        'lion_detections': detection_qs.filter(is_lion=True).count(),
        'normal_detections': detection_qs.filter(is_lion=False).count(),
    })


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


@login_required(login_url='login')
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


@login_required(login_url='login')
def profile(request):

    if request.method == "POST":
        user = request.user

        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        user.email = request.POST.get('email')

        user.save()
        return redirect('profile')

    return render(request, 'profile.html')


@login_required(login_url='login')
def map_view(request):
    return render(request, 'map.html', {'user': request.user})


@login_required(login_url='login')
@require_POST
def drone_control(request):
    data = json.loads(request.body or "{}")
    command = data.get("command")

    print("Robot Command:", command)

    return JsonResponse({"status": "ok", "command": command})


@login_required(login_url='login')
def drone_control_page(request):
    return render(request, 'drone_control.html', {'user': request.user})


def system_status(request):
    return redirect('requirements')


def alerts(request):
    return redirect('dashboard')


@login_required(login_url='login')
def requirements(request):
    return render(request, 'security.html', {'user': request.user})


@login_required(login_url='login')
def users(request):
    if not request.user.is_staff and not request.user.is_superuser:
        messages.error(request, "Only staff operators can manage user access.")
        return redirect('dashboard')

    users = User.objects.all()
    return render(request, 'users.html', {'users': users})


@login_required(login_url='login')
@require_POST
def toggle_user(request, user_id):
    if not request.user.is_staff and not request.user.is_superuser:
        messages.error(request, "Only staff operators can change user access.")
        return redirect('dashboard')

    user = get_object_or_404(User, id=user_id)
    user.is_active = not user.is_active
    user.save()
    return redirect('users')


@login_required(login_url='login')
@require_POST
def delete_user(request, user_id):
    if not request.user.is_staff and not request.user.is_superuser:
        messages.error(request, "Only staff operators can delete users.")
        return redirect('dashboard')

    user = get_object_or_404(User, id=user_id)
    if user == request.user:
        messages.error(request, "You cannot delete your own active session.")
    else:
        user.delete()
    return redirect('users')


def admin_only(user):
    return user.is_superuser


@login_required(login_url='login')
def drone_location(request):
    # to be replaced with real drone GPS later
    data = {
        "lat": -1.2921,
        "lng": 36.8219
    }
    return JsonResponse(data)


@login_required(login_url='login')
def detection_locations(request):
    detections = Detection.objects.all().order_by('-timestamp')[:50]

    data = []
    for d in detections:
        lat = getattr(d, 'latitude', None) or -1.2921
        lng = getattr(d, 'longitude', None) or 36.8219
        data.append({
            "lat": lat,
            "lng": lng,
            "is_lion": d.is_lion,
            "time": d.timestamp.strftime("%H:%M:%S"),
            "confidence": getattr(d, 'confidence', 0)
        })

    return JsonResponse(data, safe=False)


def forgot_password(request):
    if request.method == "POST":
        email = request.POST.get("email")

        if User.objects.filter(email=email).exists():
            messages.success(
                request, "Password reset link sent to your email.")
        else:
            messages.error(request, "Email not found.")

    return render(request, "forgotpassword.html")


@login_required(login_url='login')
def analytics(request):

    detections = Detection.objects.all()

    total = detections.count()
    lions = detections.filter(is_lion=True).count()
    normal = detections.filter(is_lion=False).count()

    # Threat trend for the last seven days.
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

    # Most active saved detection zones.
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


@login_required(login_url='login')
def settings_view(request):
    settings = SystemSettings.objects.first()

    if settings is None:
        settings = SystemSettings.objects.create(
            drone_name="LionGuard Patrol Robot",
            phone="",
            email="",
        )

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
