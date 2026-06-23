from django.db import models

class Alerts(models.Model):
    alert_type = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class SystemSettings(models.Model):
    drone_name = models.CharField(max_length=100)
    max_speed = models.IntegerField(default=50)
    auto_patrol = models.BooleanField(default=True)

    confidence = models.IntegerField(default=70)
    alert_enabled = models.BooleanField(default=True)
    save_images = models.BooleanField(default=True)

    phone = models.CharField(max_length=20)
    email = models.EmailField()

    refresh_rate = models.IntegerField(default=2)

class RobotTelemetry(models.Model):
    """Tracks global runtime metrics received from the robot platform."""
    robot_online = models.BooleanField(default=False)
    current_zone = models.CharField(max_length=50, default="Unknown")
    last_updated = models.DateTimeField(auto_now=True)

class Detection(models.Model):
    """Logs the analytical records for auditing, alerts, and tables."""
    is_lion = models.BooleanField(default=False)
    confidence = models.IntegerField(null=True, blank=True)
    location = models.CharField(max_length=100, default="Unknown")
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="detections/images", null=True, blank=True)