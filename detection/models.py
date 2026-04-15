from django.db import models


class Detection (models.Model):
    is_lion = models.BooleanField(default=False)
    location = models.CharField(default="Unknown", max_length=100)
    confidence = models.FloatField(null=True, blank=True)
    label = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='detections/images', null=True)


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
