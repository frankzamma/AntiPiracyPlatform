import sys
import subprocess

subprocess.run([sys.executable, '-m', 'pip', 'install', 'import image_dataset_loader'])


import image_dataset_loader


(x_train, y_train), (x_test, y_test) = image_dataset_loader.load('./data', ['train', 'test'])
