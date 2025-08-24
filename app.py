from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)

traductor = Translator()

@app.route('/')
def home():
    return render_template('index.html')  # 🔹 llama al HTML dentro de templates

@app.route('/api/traducir', methods=['POST'])
def traducir():
    data = request.get_json()
    texto = data.get("texto")
    destino = data.get("destino")
    if not texto or not destino:
        return jsonify({"error": "Faltan parámetros: 'texto' y 'destino'"}), 400
    traduccion = traductor.translate(texto, dest=destino)
    return jsonify({
        "texto_original": texto,
        "idioma_origen": traduccion.src,
        "texto_traducido": traduccion.text,
        "idioma_destino": destino
    })

if __name__ == '__main__':
    app.run(debug=True)