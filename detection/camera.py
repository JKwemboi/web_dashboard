import cv2
from ultralytics import YOLO
from .models import Detection

model = YOLO('yolov8n.pt')


def get_frames():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)

    for r in results:
        if r.boxes is not None and len(r.boxes) > 0:
            for box in r.boxes:
                label = model.names[int(box.cls)]
                conf = float(box.conf)

                if conf > 0.6:  # only strong detections
                    Detection.objects.create(
                    label=label,
                    confidence=conf
                )

        annotated = r[0].plot()

        _, buffer = cv2.imencode('.jpg', annotated)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
