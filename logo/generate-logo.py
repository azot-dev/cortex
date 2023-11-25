import cv2
import numpy as np
import shutil
import os
from PIL import Image


def create_favicon(png_path, ico_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]):
    image = Image.open(png_path)
    image.save(ico_path, format='ICO', sizes=sizes)


def copy_file(source, destination):
    if not os.path.isfile(source):
        print("The source file doesn't exist")
        return

    destination_folder = os.path.dirname(destination)
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    shutil.copy(source, destination)
    print(f"Filed copied from {source} to {destination}")


def copy_file_with_size(size, destination):
    source = 'logo_' + str(size) + '.png'
    copy_file(source, destination)


# def remove_background_and_shadow(image_path):
#     image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     blur = cv2.GaussianBlur(gray, (5, 5), 0)
#     _, thresh = cv2.threshold(blur, 180, 255, cv2.THRESH_BINARY_INV)
#     contours, _ = cv2.findContours(
#         thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#     mask = np.zeros_like(image)
#     cv2.drawContours(mask, contours, -1, (255, 255, 255), cv2.FILLED)
#     mask_gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
#     _, binary_mask = cv2.threshold(mask_gray, 180, 255, cv2.THRESH_BINARY)
#     result = cv2.bitwise_and(image, image, mask=binary_mask)
#     result[binary_mask == 0] = [255, 255, 255, 0]
#     if result.shape[2] < 4:
#         result = cv2.cvtColor(result, cv2.COLOR_BGR2BGRA)
#     return result


# def crop_logo_to_square(image):
#     contours, _ = cv2.findContours(cv2.cvtColor(
#         image, cv2.COLOR_BGR2GRAY), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#     largest_contour = max(contours, key=cv2.contourArea)
#     x, y, w, h = cv2.boundingRect(largest_contour)
#     cropped_image = image[y:y+h, x:x+w]

#     cv2.imwrite('cropped.png', cropped_image)
#     rect_image = image.copy()
#     print(x, y, w,)
#     cv2.rectangle(rect_image, (x, y), (x + w, y + h), (0, 255, 0), 2)
#     cv2.imwrite('rect_image.png', rect_image)
#     size = max(w, h)

#     square_image = cv2.copyMakeBorder(cropped_image,
#                                       top=(size-h)//2,
#                                       bottom=(size-h)//2,
#                                       left=(size-w)//2,
#                                       right=(size-w)//2,
#                                       borderType=cv2.BORDER_CONSTANT,
#                                       value=[255, 255, 255, 0])
#     return square_image


# image_path = 'original_logo.png'
# result_img_no_shadow = remove_background_and_shadow(image_path)
# result_img_square = crop_logo_to_square(result_img_no_shadow)
# cv2.imwrite('square.png', result_img_square)

image = cv2.imread('logo.png', cv2.IMREAD_UNCHANGED)

create_favicon('logo.png', './favicon.ico')

sizes = [16, 48, 128, 256, 512]
for size in sizes:
    resized_image_square = cv2.resize(
        image, (size, size), interpolation=cv2.INTER_AREA)
    resized_square_path = f'logo_{size}.png'
    cv2.imwrite(resized_square_path, resized_image_square)


# Chrome extension

copy_file_with_size(16, '../chrome-extension/src/images')
copy_file_with_size(48, '../chrome-extension/src/images')
copy_file_with_size(128, '../chrome-extension/src/images')

copy_file_with_size(16, '../chrome-extension/dist/images')
copy_file_with_size(48, '../chrome-extension/dist/images')
copy_file_with_size(128, '../chrome-extension/dist/images')

# Core

copy_file_with_size(512, '../core/assets')

# doc
copy_file_with_size(256, '../doc/static/img')
copy_file_with_size(512, '../doc/static/img')
copy_file('./favicon.ico', '../doc/static/img')
