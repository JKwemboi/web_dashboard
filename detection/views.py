from django.http import StreamingHttpResponse
from .camera import get_frames
from django.shortcuts import render
from .models import Detection


def video_feed(request):
    return StreamingHttpResponse(get_frames(),
                                 content_type='multipart/x-mixed-replace; boundary=frame')


def dashboard(request):
    detections = Detection.objects.all().order_by('-timestamp')[:10]
    return render(request, 'dashboard.html', {'detections': detections})
