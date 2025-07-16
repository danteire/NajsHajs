import json
from pathlib import Path
from typing import List

import torch
import torch.nn as nn
from joblib import load
from PIL import Image, ImageOps
from torchvision.transforms import v2 as transforms
from torchvision.models import mobilenet_v3_large


embedder_path       = 'embedder/mobilenetv3_embedder_full.pth'
to_classify_path    = 'classify/'
models_base_path    = 'models/'


# ——— Twój embedder ———
class MobileNetV3Embedder(nn.Module):
    def __init__(self, weights, freeze_backbone=False,
                 embedding_dim=512, num_classes=25):
        super().__init__()
        self.backbone = mobilenet_v3_large(weights=weights)
        if freeze_backbone:
            for p in self.backbone.parameters(): p.requires_grad = False
        self.backbone.classifier = nn.Identity()
        self.projector = nn.Sequential(
            nn.Linear(960, embedding_dim),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(embedding_dim)
        )
        self.classifier = nn.Linear(embedding_dim, num_classes)

    def forward(self, x):
        features   = self.backbone(x)
        embeddings = self.projector(features)
        embeddings = nn.functional.normalize(embeddings, p=2, dim=1)
        logits     = self.classifier(embeddings)
        return logits, embeddings


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


def main():
    # ——— Load embedder & classifiers & labels ———
    embedder = torch.load(embedder_path, map_location='cpu', weights_only=False)
    embedder.eval()

    scaler = load(f"{models_base_path}scaler.joblib")
    knn    = load(f"{models_base_path}kNN_k5.joblib")
    rf     = load(f"{models_base_path}RandomForest.joblib")
    svm    = load(f"{models_base_path}SVM_linear.joblib")

    with open(f"{models_base_path}labels.txt", 'r') as f:
        labels = [l.strip() for l in f]

    files = list_files_in_directory(to_classify_path)
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


if __name__ == '__main__':
    main()
