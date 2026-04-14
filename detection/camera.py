# import cv2
# from ultralytics import YOLO
# from .models import Detection

# model = YOLO('yolov8n.pt')


# def get_frames():
#     cap = cv2.VideoCapture(0)

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         results = model(frame)

#         for result in results:
#             for box in result.boxes:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])
#                 confidence = float(box.conf[0])
#                 label = model.names[int(box.cls[0])]

#                 if confidence > 0.5:
#                     cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                     cv2.putText(frame, f'{label} {confidence:.2f}', (x1, y1 - 10),
#                                 cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)

#                     Detection.objects.create(
#                         is_lion=(label == 'lion'),
#                         location=f'({x1}, {y1})',
#                         confidence=confidence,
#                         label=label
#                     )

#         _, buffer = cv2.imencode('.jpg', annotated)
#         frame = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
