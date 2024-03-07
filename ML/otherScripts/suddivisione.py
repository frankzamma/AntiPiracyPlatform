import os
import shutil
import numpy as np

source1 = "data"
dest11 = "test"

if not(os.path.exists('data/test')):
    os.mkdir('data/test')
dir = os.listdir(source1)

for d in dir:
    files = os.listdir("data/" + d)
    if not (os.path.exists('test/' + d)):
        os.mkdir('test/' + d)
    for f in files:
        if np.random.rand(1) < 0.2:
            shutil.move(source1 + '/' + d + '/' + f, dest11 + '/' + d + '/' + f)


