import json
from pathlib import Path
from typing import List

import torch
import torch.nn as nn
from joblib import load
from PIL import Image, ImageOps
from torchvision.transforms import v2 as transforms
from torchvision.models import mobilenet_v3_large
from models.V2.embedder.embedding_model import MobileNetV3Embedder

from django.conf import settings
import os

embedder_path = os.path.join(settings.BASE_MODELS_DIR, 'V2', 'embedder', 'mobilenetv3_embedder_full.pth')
models_base_path = os.path.join(settings.BASE_MODELS_DIR, 'V2', 'models')
to_classify_path = os.path.join(settings.BASE_MODELS_DIR, 'V2', 'classify')

# embedder_path       = "embedder/mobilenetv3_embedder_full.pth"
# to_classify_path    = 'classify/'
# models_base_path    = 'models/'



# ——— Transformacje ———
def pad_to_square(img):
    w, h = img.size
    m = max(w, h)
    pad = ((m - w)//2, (m - h)//2, (m - w + 1)//2, (m - h + 1)//2)
    return ImageOps.expand(img, pad, fill=(0,0,0))

transform_mobilenet = transforms.Compose([
    transforms.Lambda(pad_to_square),
    transforms.Resize((224, 224)),
    transforms.Compose([
        transforms.ToImage(),
        transforms.ToDtype(torch.float32, scale=True)
    ]),
    transforms.Normalize(mean=[0.485,0.456,0.406],
                         std=[0.229,0.224,0.225])
])


def extract_embeddings(embedder, pil_img):
    img_t = transform_mobilenet(pil_img).unsqueeze(0)
    with torch.no_grad():
        logits, embeddings = embedder(img_t)
    return logits.squeeze().cpu().numpy(), embeddings.squeeze().cpu().numpy()


def list_files_in_directory(dir_path: str) -> List[Path]:
    p = Path(dir_path)
    if not p.is_dir():
        raise ValueError(f"'{dir_path}' nie jest katalogiem")
    return [f for f in p.iterdir() if f.is_file()]


def proba_dict(proba: List[float], labels: List[str]) -> dict:
    """
    Zamienia listę prawdopodobieństw na słownik {label: proba}.
    """
    return {labels[i]: float(proba[i]) for i in range(len(labels))}


def classify(clf, embeddings):
    pred      = clf.predict(embeddings.reshape(1, -1))[0]
    proba_vec = clf.predict_proba(embeddings.reshape(1, -1))[0]
    return pred, proba_vec

_embedder = None

def get_embedder():
    global _embedder
    if _embedder is None:
        import sys
        import torch.serialization

        # 1. Rejestrujemy klasę jako bezpieczną
        torch.serialization.add_safe_globals({'__main__.MobileNetV3Embedder': MobileNetV3Embedder})

        # 2. Alternatywnie dla starszych wersji Pythona — obejście:
        sys.modules['__main__'].MobileNetV3Embedder = MobileNetV3Embedder

        # 3. Ładujemy model z weights_only=False
        _embedder = torch.load(embedder_path, map_location='cpu', weights_only=False)
    return _embedder

def perform_classification_on_image(pil_image: Image.Image) -> dict:
    embedder = get_embedder()
    embedder.eval()

    scaler = load(os.path.join(models_base_path, "scaler.joblib"))
    knn = load(os.path.join(models_base_path, "kNN_k5.joblib"))
    rf = load(os.path.join(models_base_path, "RandomForest.joblib"))
    svm = load(os.path.join(models_base_path, "SVM_linear.joblib"))

    with open(os.path.join(models_base_path, "labels.txt"), 'r') as f:
        labels = [l.strip() for l in f]

    try:
        logits, emb = extract_embeddings(embedder, pil_image)
        emb = scaler.transform(emb.reshape(1, -1))[0]

        pk, pk_vec = classify(knn, emb)
        pr, pr_vec = classify(rf,  emb)
        ps, ps_vec = classify(svm, emb)

        return {
            'knn': {
                'pred': labels[pk],
                'proba': proba_dict(pk_vec, labels)
            },
            'rf': {
                'pred': labels[pr],
                'proba': proba_dict(pr_vec, labels)
            },
            'svm': {
                'pred': labels[ps],
                'proba': proba_dict(ps_vec, labels)
            }
        }

    except Exception as e:
        raise RuntimeError(f"Błąd podczas klasyfikacji obrazu: {e}")


def perform_classification(pil_image):
    # ——— Load embedder & classifiers & labels ———
    embedder = get_embedder()
    embedder.eval()

    scaler = load(os.path.join(models_base_path, "scaler.joblib"))
    knn = load(os.path.join(models_base_path, "kNN_k5.joblib"))
    rf = load(os.path.join(models_base_path, "RandomForest.joblib"))
    svm = load(os.path.join(models_base_path, "SVM_linear.joblib"))

    # knn    = load(f"{models_base_path}kNN_k5.joblib")
    # rf     = load(f"{models_base_path}RandomForest.joblib")
    # svm    = load(f"{models_base_path}SVM_linear.joblib")

    with open(os.path.join(models_base_path, "labels.txt"), 'r') as f:
        labels = [l.strip() for l in f]

    files = pil_image
    if not files:
        print("Brak plików do klasyfikacji w:", to_classify_path)
        return

    results = []
    for img_path in files:
        try:
            pil = Image.open(img_path).convert('RGB')
            logits, emb = extract_embeddings(embedder, pil)
            emb = scaler.transform(emb.reshape(1, -1))[0]

            pk, pk_vec = classify(knn, emb)
            pr, pr_vec = classify(rf,  emb)
            ps, ps_vec = classify(svm, emb)

            results.append({
                'file': img_path.name,
                'knn': {
                    'pred': labels[pk],
                    'proba': proba_dict(pk_vec, labels)
                },
                'rf': {
                    'pred': labels[pr],
                    'proba': proba_dict(pr_vec, labels)
                },
                'svm': {
                    'pred': labels[ps],
                    'proba': proba_dict(ps_vec, labels)
                },
            })

        except Exception as e:
            print(f"[ERROR] {img_path.name}: {e}")

    # ——— Zapisz do JSON ———
    out = Path('classification_results.json')
    out.write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print("Wyniki zapisane w:", out)

perform_classification(None)