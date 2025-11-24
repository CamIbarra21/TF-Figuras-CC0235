import tempfile
import os
from flask import Flask, render_template, request, redirect, send_file
from skimage import io
import base64
import glob
import numpy as np
import zipfile
import io as io_module

figuras = ["circulo", "cuadrado", "rectangulo", "triangulo", "rombo", "ovalo", "corazon"]

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("main.html")


@app.route('/upload', methods=['POST'])
def upload():
    try:
        # check if the post request has the file part
        img_data = request.form.get('myImage').replace("data:image/png;base64,","")
        aleatorio = request.form.get('numero')
        print(aleatorio)
        with tempfile.NamedTemporaryFile(delete = False, mode = "w+b", suffix='.png', dir=str(aleatorio)) as fh:
            fh.write(base64.b64decode(img_data))
        #file = request.files['myImage']
        print("Image uploaded")
    except Exception as err:
        print("Error occurred")
        print(err)

    return redirect("/", code=302)


@app.route('/prepare', methods=['GET'])
def prepare_dataset():
    images = []
    #d = ["U", "P", "C"]
    #f = ["circulo", "cuadrado", "rectangulo", "triangulo", "rombo", "ovalo", "corazon"]
    digits = []

    for figura in figuras:
      filelist = glob.glob('{}/*.png'.format(figura))
      images_read = io.concatenate_images(io.imread_collection(filelist))
      images_read = images_read[:, :, :, 3]
      digits_read = np.array([figura] * images_read.shape[0])
      images.append(images_read)
      digits.append(digits_read)

    images = np.vstack(images)
    digits = np.concatenate(digits)
    np.save('X.npy', images)
    np.save('y.npy', digits)
    
    # Crear un archivo ZIP con los dos archivos
    zip_buffer = io_module.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.write('X.npy', arcname='X.npy')
        zip_file.write('y.npy', arcname='y.npy')
    
    zip_buffer.seek(0)
    return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name='dataset.zip')


@app.route('/X.npy', methods=['GET'])
def download_X():
    return send_file('./X.npy')


@app.route('/y.npy', methods=['GET'])
def download_y():
    return send_file('./y.npy')


if __name__ == "__main__":
    for figura in figuras:
        if not os.path.exists(figura):
            os.mkdir(figura)

    app.run(debug=True)
