from flask import Flask, request, jsonify

#Fiz esse script só pra testar o envio do core_connection e afins
app = Flask(__name__)

@app.route('/push', methods=['POST'])
def push():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON received"}), 400

    print("Dados recebidos no /push:")
    print(data)

    return jsonify({"message": "Dados recebidos com sucesso!", "received": data}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
