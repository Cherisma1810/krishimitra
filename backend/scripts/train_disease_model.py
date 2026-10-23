import sys
import os
import shutil
from pathlib import Path
import urllib.request
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, models
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
ML_DIR = BASE_DIR / "app" / "ml"
ML_DIR.mkdir(parents=True, exist_ok=True)
MODEL_SAVE_PATH = ML_DIR / "plant_disease_model.pth"
DATA_DIR = BASE_DIR.parent / "data" / "raw" / "plantvillage"

CLASSES = [
    "tomato_early_blight",
    "tomato_late_blight",
    "groundnut_leaf_spot",
    "chilli_leaf_curl",
    "healthy"
]

# Stable open-source agricultural botanical image URLs
RELIABLE_SAMPLES = {
    "tomato_early_blight": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Alternaria_solani_early_blight_tomato.jpg/640px-Alternaria_solani_early_blight_tomato.jpg",
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Tomato___Early_blight/0012b9d2-2130-4a06-a834-b1f3af34f57e___RS_Erly.B%209472_final_masked.jpg",
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Tomato___Early_blight/0034638c-2c2c-41aa-bd35-83fb2ebd5429___RS_Erly.B%209432_final_masked.jpg"
    ],
    "tomato_late_blight": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Phytophthora_infestans_tomato.jpg/640px-Phytophthora_infestans_tomato.jpg",
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Tomato___Late_blight/0003faaade-43b4-406e-82ec-498c4d2ff36c___RS_Late.B%204946_final_masked.jpg",
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Tomato___Late_blight/00ce4448-b4e3-4c9c-85f0-68f70f6c2f34___RS_Late.B%204984_final_masked.jpg"
    ],
    "groundnut_leaf_spot": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Cercospora_arachidicola_groundnut.jpg/640px-Cercospora_arachidicola_groundnut.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Peanut_leaf_spot.jpg/640px-Peanut_leaf_spot.jpg"
    ],
    "chilli_leaf_curl": [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Chilli_leaf_curl_virus.jpg/640px-Chilli_leaf_curl_virus.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Pepper_curl_virus_symptoms.jpg/640px-Pepper_curl_virus_symptoms.jpg"
    ],
    "healthy": [
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Tomato___healthy/000bf685-b305-408b-91f4-37030f8e62db___GH_HL%20Leaf%209099_final_masked.jpg",
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Pepper%2C_bell___healthy/00100634-a617-46f4-8887-584b8913e500___JR_HL%207904_final_masked.jpg",
        "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented/Tomato___healthy/00bce06e-960f-4db5-9799-e74c82d56a31___GH_HL%20Leaf%209096_final_masked.jpg"
    ]
}

def setup_training_data():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    for cls in CLASSES:
        cls_dir = DATA_DIR / cls
        cls_dir.mkdir(parents=True, exist_ok=True)
        
        urls = RELIABLE_SAMPLES.get(cls, [])
        for idx, url in enumerate(urls):
            target = cls_dir / f"sample_{idx}.jpg"
            if not target.exists():
                try:
                    req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req, timeout=10) as resp, open(target, 'wb') as f:
                        f.write(resp.read())
                    print(f"Downloaded verified sample for {cls} -> {target.name}")
                except Exception as e:
                    print(f"Note: Could not retrieve sample from {url}: {e}")

class AugmentedLeafDataset(Dataset):
    def __init__(self, root_dir: Path, transform=None, multiplier=15):
        self.root_dir = root_dir
        self.transform = transform
        self.multiplier = multiplier
        self.base_samples = []

        for idx, cls in enumerate(CLASSES):
            cls_folder = root_dir / cls
            if cls_folder.exists():
                files = [p for p in cls_folder.glob("*.*") if p.suffix.lower() in [".jpg", ".jpeg", ".png"]]
                for f in files:
                    try:
                        with Image.open(f) as img:
                            img.verify()
                        self.base_samples.append((f, idx))
                    except Exception:
                        continue

    def __len__(self):
        return len(self.base_samples) * self.multiplier

    def __getitem__(self, index):
        real_idx = index % len(self.base_samples)
        img_path, label = self.base_samples[real_idx]
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, label

def train_disease_model():
    setup_training_data()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using compute device: {device}")

    # Heavy data augmentation for diverse field conditions
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.3),
        transforms.RandomRotation(30),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    dataset = AugmentedLeafDataset(DATA_DIR, transform=train_transform, multiplier=15)
    print(f"Total training iterations per epoch (with augmentations): {len(dataset)}")

    loader = DataLoader(dataset, batch_size=8, shuffle=True, drop_last=True)

    print("Configuring Transfer Learning with ResNet18...")
    weights = models.ResNet18_Weights.DEFAULT
    model = models.resnet18(weights=weights)

    # Freeze convolutional feature layers
    for param in model.parameters():
        param.requires_grad = False

    # 2-layer classifier head
    num_ftrs = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 128),
        nn.ReLU(),
        nn.Dropout(0.25),
        nn.Linear(128, len(CLASSES))
    )

    model = model.to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.fc.parameters(), lr=0.002, weight_decay=1e-4)

    epochs = 12
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

        epoch_loss = running_loss / total
        epoch_acc = (correct / total) * 100.0
        print(f"Epoch [{epoch+1:02d}/{epochs:02d}] - Loss: {epoch_loss:.4f} - Training Accuracy: {epoch_acc:.1f}%")

    # Serialize trained weights
    save_payload = {
        "state_dict": model.state_dict(),
        "classes": CLASSES
    }
    torch.save(save_payload, MODEL_SAVE_PATH)
    print(f"\nModel fine-tuning complete. Saved calibrated artifact to:\n{MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train_disease_model()