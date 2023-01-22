from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
cors = CORS(app)

@app.route("/receiver", methods=["POST"])
def postME():
    print("Incoming request.")
    data = request.get_json()
    download_image(data)
    if os.path.isfile("image.png"):
        res = rgs("image.png")
    else:
        return jsonify("Image failed to donwload")
    print("Final answer:", res)
    if res:
        data = jsonify(res)
    else:
        data = jsonify("None")
    os.remove("image.png")
    return data

def download_image(url):
    r = requests.get(url, allow_redirects=True)
    open('image.png', 'wb').write(r.content)


def rgs(image_path):
    from GoogleSearch import Search
    output = Search(file_path=image_path)

    if output["output"]:
        output = output["output"].split("\xa0")
        return output[1] # skin name
    else:
        return False

if __name__ == "__main__":
    app.run()
