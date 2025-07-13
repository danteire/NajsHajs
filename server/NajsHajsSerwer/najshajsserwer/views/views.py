import random
import os
import base64
import sys
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from io import BytesIO
from PIL import Image

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
sys.path.append(project_root)

from models.V2.classify import perform_classification, perform_classification_on_image

@csrf_exempt
def upload_image(request):

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            image_base64 = data.get("image")

            if not image_base64:
                return JsonResponse({"error": "Image data is missing or empty."}, status=400)

            # Dekoduj base64 i wczytaj obraz do PIL Image
            image_data = base64.b64decode(image_base64)
            pil_image = Image.open(BytesIO(image_data)).convert('RGB')

            # Wywołaj funkcję klasyfikującą z pliku classify.py
            classification_results = perform_classification_on_image(pil_image)

            # Dodaj dodatkowe informacje do wyniku
            classification_results["currency"] = "PLN"
            classification_results["timestamp"] = datetime.now().isoformat()
            # Nie ma już "file_saved" bo nie zapisujemy pliku

            # Zwróć przetworzony wynik
            return JsonResponse(classification_results, status=200)

        except (json.JSONDecodeError, base64.binascii.Error) as e:
            return JsonResponse({"error": f"Niepoprawne dane obrazu lub format JSON: {e}"}, status=400)
        except RuntimeError as e:
            # Przechwytuj błędy z funkcji perform_classification
            return JsonResponse({"error": f"Błąd przetwarzania obrazu: {e}"}, status=510)
        except Exception as e:
            # Ogólny catch dla innych błędów
            return JsonResponse({"error": f"Wystąpił nieoczekiwany błąd: {e}"}, status=520)

    return JsonResponse({"error": "Nieprawidłowa metoda żądania. Oczekiwano POST."}, status=405)