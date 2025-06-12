from flask import Flask, render_template, request, redirect, url_for
import payload
import publish
app = Flask(__name__)
candidates = [
    {"id": 1, "name": "Prefeito de Sorocaba", "image": "1.png"},
    {"id": 2, "name": "Pastor Mirim", "image": "2.jpg"},
    {"id": 3, "name": "Damaso", "image": "3.jpg"},
    {"id": 4, "name": "Romário", "image": "4.jpg"},
    {"id": 5, "name": "Tiririca", "image": "5.jpg"},
]

@app.route('/')
def index():
    return render_template('index.html', candidates=candidates)

@app.route('/vote', methods=['POST'])
def vote():
    candidate_id = request.form.get('candidate_id')


    # print(payload.generate_payload(candidate_id))
    mensagem  = payload.generate_payload(candidate_id)

    publish.publish_message("votacao_api", mensagem)


    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

