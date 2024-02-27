# app.py
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)

#Carica il modello salvato con joblib
model = tf.keras.models.load_model('./robust_classifier.h5')

#@app.post("/predict")
@app.route('/predict', methods=['GET'])
def predict():
    try:

        url = request.args.get('url')
        print(url)
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))

        #Preprocesso l'immagine
        processed_image = preprocess_image(image)

        # Effettua la predizione
        prediction = model.predict(processed_image)

        #prediction_string = decode_sport(int(np.argmax(prediction[0])))

        return jsonify({'prediction': int(np.argmax(prediction[0]))})

    except Exception as e:
        return jsonify({'error': str(e)})



def preprocess_image(image):
    #image = Image.open(image_path)
    # Ridimensiona l'immagine a 128x128
    image = image.resize((128, 128))

    image_array = np.array(image) / 255.0  # Normalizza i valori dei pixel tra 0 e 1
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def decode_sport(n):
    if n == 0:
        return 'basketball'

    if n == 1:
        return 'boxing'

    if n == 2:
        return 'fencing'

    if n == 3:
        return 'football'

    if n == 4:
        return 'formula1'

    if n == 5:
        return 'motogp'

    if n == 6:
        return 'swimming'

    if n == 7:
        return 'tennis'

    if n == 8:
        return 'volleyball'


