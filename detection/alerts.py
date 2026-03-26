from .models import Alerts


def trigger_alert(label):
    if label == 'lion':
        # I will implement buzer
        print('Buzzer Noise')

        # saving alert
        Alerts.objects.create(
            alerts_type="Community Danger",
            message='Lion detected in the nearby'
        )

        Alerts.objects.create(
            alerts_type='KWS TResponse',
            message='Lion detected'
        )
