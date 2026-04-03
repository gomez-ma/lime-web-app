import os

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "../dataset")

def check_folder(split):
    img_dir = os.path.join(DATASET_PATH, "images", split)
    lbl_dir = os.path.join(DATASET_PATH, "labels", split)

    print(f"\n🔍 Checking {split}...")

    if not os.path.exists(img_dir):
        print(f"❌ Missing folder: {img_dir}")
        return False

    images = os.listdir(img_dir)

    if len(images) == 0:
        print(f"❌ No images in {split}")
        return False

    ok = True

    for img in images:
        if not img.endswith(".jpg"):
            continue

        label_file = img.replace(".jpg", ".txt")
        label_path = os.path.join(lbl_dir, label_file)

        if not os.path.exists(label_path):
            print(f"❌ Missing label: {label_file}")
            ok = False

    print(f"✅ {split}: {len(images)} images checked")
    return ok

def main():
    print("🚀 Checking YOLO Dataset...")

    train_ok = check_folder("train")
    val_ok = check_folder("val")

    if train_ok and val_ok:
        print("\n✅ Dataset is READY for training")
    else:
        print("\n❌ Dataset has problems")

if __name__ == "__main__":
    main()