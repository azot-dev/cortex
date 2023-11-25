from PIL import Image


def remove_white_background(image_path, output_size):
    image = Image.open(image_path)
    image = image.convert("RGBA")

    datas = image.getdata()
    newData = []

    for item in datas:
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    image.putdata(newData)

    image = image.resize((output_size, output_size), Image.ANTIALIAS)
    return image


image_path = "your_logo.png"
sizes = [16, 48, 128, 256, 512]

for size in sizes:
    resized_image = remove_white_background(image_path, size)
    resized_image.save(f"logo_{size}.png")
