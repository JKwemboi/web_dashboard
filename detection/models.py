from django.db import models


class Detection (models.Model):
    is_lion = models.BooleanField( default=False)
    location = models.CharField(default="Unknown", max_length=100)
    confidence = models.FloatField(null=True, blank=True)
    label = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='detections/', null=True)


class Alerts(models.Model):
    alert_type = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
