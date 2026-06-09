import cv2
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import StreamingHttpResponse, JsonResponse
from detection.models import Detection, RobotTelemetry
from django.db.models import Count
from datetime import datetime, timedelta
from .models import SystemSettings
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.utils import timezone
import json
from urllib import error, request as urlrequest
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt



ROBOT_MOVEMENT_COMMANDS = {"forward", "backward", "left", "right", "stop"}


@csrf_exempt
def receive_telemetry(request):
    """
    API endpoint listening for inbound packets posted by the Pi.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # 1. Capture system state settings configuration
            telemetry, created = RobotTelemetry.objects.get_or_create(id=1)
            telemetry.robot_online = data.get('robot_online', True)
            telemetry.current_zone = data.get('current_zone', 'Unknown')
            telemetry.save()
            
            # 2. Append threat incident directly to logs database
            is_lion = data.get('is_lion', False)
            if is_lion: 
                Detection.objects.create(
                    is_lion=is_lion,
                    confidence=data.get('confidence'),
                    location=data.get('current_zone')
                )
                
            return JsonResponse({"status": "success"}, status=201)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
            
    return JsonResponse({"status": "method not allowed"}, status=405)


def _dashboard_refresh_interval_ms():
    system_settings = SystemSettings.objects.first()
    refresh_seconds = getattr(system_settings, "refresh_rate", None) or 2

    try:
        refresh_seconds = int(refresh_seconds)
    except (TypeError, ValueError):
        refresh_seconds = 2

    return max(1, min(refresh_seconds, 30)) * 1000


def _format_confidence(confidence):
    if confidence is None:
        return "--"

    try:
        value = float(confidence)
    except (TypeError, ValueError):
        return "--"

    if 0 <= value <= 1:
        value *= 100

    return f"{value:.1f}".rstrip("0").rstrip(".")


def _serialize_detection(detection):
    timestamp = timezone.localtime(detection.timestamp)

    return {
        "id": detection.id,
        "is_lion": detection.is_lion,
        "label": detection.label or ("Lion" if detection.is_lion else "Detection"),
        "title": "Threat Detected" if detection.is_lion else "Safe Event",
        "kind": "Threat" if detection.is_lion else "Safe",
        "status": "Alert Sent" if detection.is_lion else "Normal",
        "status_class": "status-danger" if detection.is_lion else "status-safe",
        "location": detection.location or "Unknown",
        "confidence": _format_confidence(detection.confidence),
        "timestamp": timestamp.isoformat(),
        "time_short": timestamp.strftime("%b %d, %H:%M"),
        "image_url": detection.image.url if detection.image else "",
    }


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
        'dashboard_refresh_ms': _dashboard_refresh_interval_ms(),
    })


@login_required(login_url='login')
def dashboard_data(request):
    detection_qs = Detection.objects.all().order_by('-timestamp')
    detections = [_serialize_detection(detection) for detection in detection_qs[:6]]

    return JsonResponse({
        "detections": detections,
        "total_detections": detection_qs.count(),
        "lion_detections": detection_qs.filter(is_lion=True).count(),
        "normal_detections": detection_qs.filter(is_lion=False).count(),
        "latest_detection_id": detections[0]["id"] if detections else None,
        "refresh_interval_ms": _dashboard_refresh_interval_ms(),
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
def dashboard_data_view(request):
    """
    API endpoint polled by the dashboard webpage every 2 seconds.
    """
    # 1. Pull current online and location tracking telemetry
    try:
        telemetry = RobotTelemetry.objects.get(id=1)
        robot_online = telemetry.robot_online
        current_zone = telemetry.current_zone
    except RobotTelemetry.DoesNotExist:
        robot_online = False
        current_zone = "Offline"

    # 2. Aggregate core metrics
    total_detections = Detection.objects.count()
    lion_detections = Detection.objects.filter(is_lion=True).count()
    
    # 3. Pull last 10 entries to compile visual logs arrays
    recent_events = Detection.objects.order_by('-timestamp')[:10]
    detections_list = []
    
    for d in recent_events:
        detections_list.append({
            "title": "Threat Detected" if d.is_lion else "Safe Event",
            "kind": "Threat" if d.is_lion else "Safe",
            "is_lion": d.is_lion,
            "status": "Alert Sent" if d.is_lion else "Normal",
            "status_class": "status-danger" if d.is_lion else "status-safe",
            "location": d.location or "Unknown zone",
            "time_short": d.timestamp.strftime("%b %d, %H:%M"),
            "confidence": int(d.confidence) if d.confidence else "--",
            "image_url": d.image.url if d.image else None
        })

    return JsonResponse({
        "total_detections": total_detections,
        "lion_detections": lion_detections,
        "robot_online": robot_online,
        "current_zone": current_zone,
        "detections": detections_list
    })

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
def robot_control(request):
    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)

    command = data.get("command")
    if command not in ROBOT_MOVEMENT_COMMANDS:
        return JsonResponse(
            {
                "status": "error",
                "message": "Unsupported robot command",
                "allowed_commands": sorted(ROBOT_MOVEMENT_COMMANDS),
            },
            status=400,
        )

    print("Robot Command:", command)

    esp32_url = getattr(settings, "ESP32_COMMAND_URL", "")
    if esp32_url:
        payload = json.dumps({"command": command}).encode("utf-8")
        esp32_request = urlrequest.Request(
            esp32_url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlrequest.urlopen(esp32_request, timeout=2) as response:
                return JsonResponse({
                    "status": "ok",
                    "command": command,
                    "esp32_status": response.status,
                })
        except (error.URLError, TimeoutError) as exc:
            return JsonResponse(
                {
                    "status": "error",
                    "command": command,
                    "message": f"ESP32 command failed: {exc}",
                },
                status=502,
            )

    return JsonResponse({"status": "ok", "command": command})


@login_required(login_url='login')
def robot_control_page(request):
    return render(request, 'robot_control.html', {'user': request.user})


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
def robot_location(request):
    # to be replaced with real robot GPS later
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
        settings.drone_name = request.POST.get('robot_name') or request.POST.get('drone_name')
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

    return render(request, 'setting.html', {
        'settings': settings,
        'robot_name': settings.drone_name,
    })
