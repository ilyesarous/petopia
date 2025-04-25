from flask import Flask, request, jsonify
from torchvision import models, transforms
from torchvision.models import ResNet18_Weights
from PIL import Image
from collections import Counter
import mysql.connector
import torch
import io

app = Flask(__name__)

weights = ResNet18_Weights.DEFAULT
model = models.resnet18(weights=weights)
model.eval()
imagenet_classes = weights.meta["categories"]


def predict_image(image_bytes):
    transform = weights.transforms()
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(tensor)
    _, predicted = outputs.max(1)
    class_id = predicted.item()
    breed = imagenet_classes[class_id]

    if 151 <= class_id <= 268:
        return "DOG", breed
    elif 281 <= class_id <= 285:
        return "CAT", breed
    else:
        return "Neither Cat nor Dog", breed


def get_reclamation_stats():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="petopia"
    )
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT type FROM reclamation")
    rows = cursor.fetchall()
    connection.close()

    types = [row["type"] for row in rows]
    count_by_type = Counter(types)

    return dict(count_by_type)


@app.route('/reclamations/stats', methods=['GET'])
def reclamation_stats():
    stats = get_reclamation_stats()
    return jsonify(stats)


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    image_bytes = file.read()
    label, breed = predict_image(image_bytes)

    return jsonify({
        'prediction': label,
        'breed': breed
    })


if __name__ == '__main__':
    app.run(debug=True)
