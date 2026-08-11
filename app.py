from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/executive")
def executive():
    return render_template("executive.html")

@app.route("/cinematic")
def cinematic():
    return render_template("cinematic.html")

if __name__ == "__main__":
    app.run(debug=True)
