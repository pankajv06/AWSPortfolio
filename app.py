from flask import Flask, render_template, redirect, url_for

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

@app.route("/resume")
def resume():
    return redirect(url_for("static", filename="Pankaj_Verma_Resume.pdf"))