import google.generativeai as genai
import PIL.Image
import sys
import os

def process_image(image_path):
    # Check if the file exists before attempting to open it
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"The file {image_path} does not exist.")
    
    # Configure the API key (consider using environment variables)
    genai.configure(api_key='AIzaSyA6Q76uG7xem2lke93XIxv7jyGy1w8yRgw')
    img = PIL.Image.open(image_path)

    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    response = model.generate_content([
        "Extract all the essential information from the image by removing the noise like Hindi or any other language, only give the output in English and numerical in JSON format.",
        img
    ])

    return response.text

if __name__ == "__main__":
    image_path = sys.argv[1]
    try:
        result = process_image(image_path)
        print(result)
    except Exception as e:
        print(f"Error processing image: {e}", file=sys.stderr)
        sys.exit(1)
