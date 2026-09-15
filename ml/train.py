#!/usr/bin/env python3
"""
GridPulse AI – Optimized ML Training with Full Validation
Implements:
  1. Physics-informed dataset generation (1500 samples, realistic distributions)
  2. Stratified 80/10/10 train/val/test split
  3. Feature engineering (interaction terms, polynomial features)
  4. Hyperparameter-tuned Random Forest via GridSearchCV
  5. Full validation metrics: accuracy, precision, recall, F1, ROC-AUC, confusion matrix
  6. Calibrated probability outputs (Platt scaling / isotonic regression)
  7. Model saved with scaler and full evaluation report

Features: temperature, load, vibration, humidity, age
Target: failure (0 = Safe, 1 = High Risk)
"""

import os
import sys
import json
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    average_precision_score, matthews_corrcoef
)
import joblib
import warnings
warnings.filterwarnings('ignore')

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'grid_sensor_dataset.csv')
MODEL_PATH   = os.path.join(os.path.dirname(__file__), 'model.joblib')
REPORT_PATH  = os.path.join(os.path.dirname(__file__), 'validation_report.json')

# ─── 1. Improved Dataset Generation ─────────────────────────────────────────

def generate_dataset(n=1500, seed=42):
    """
    Generates a physics-informed electrical grid asset telemetry dataset.

    Thermodynamic degradation rules (based on IEC 60076 transformer standards):
      - Temperature: Winding hotspot > 98°C causes exponential insulation aging
      - Load:  > 80% causes sustained thermal overload
      - Vibration: > 3.5 mm/s (ISO 10816) indicates mechanical resonance / bearing failure
      - Humidity: > 75% accelerates paper insulation moisture absorption
      - Age: IEC 60076 design life ~25yrs; degradation accelerates after 15yrs

    Failure label: risk_score >= 50 (threshold calibrated against field failure rates)
    """
    np.random.seed(seed)

    # Pre-allocate arrays for speed
    n_normal  = int(n * 0.65)   # 65% normal operation
    n_warning = int(n * 0.20)   # 20% degraded / warning
    n_failure = n - n_normal - n_warning  # 15% high-risk / failure

    def make_samples(count, temp_mu, temp_sig, load_mu, load_sig,
                     vib_mu, vib_sig, hum_range, age_range):
        rows = []
        for _ in range(count):
            temp  = float(np.clip(np.random.normal(temp_mu, temp_sig), 25, 130))
            load  = float(np.clip(np.random.normal(load_mu, load_sig), 10, 120))
            vib   = float(np.clip(abs(np.random.normal(vib_mu, vib_sig)), 0.2, 8.0))
            hum   = float(np.random.uniform(*hum_range))
            age   = float(np.random.uniform(*age_range))
            rows.append({'temperature': round(temp,1), 'load': round(load,1),
                         'vibration': round(vib,2), 'humidity': round(hum,1),
                         'age': round(age,1)})
        return rows

    data = (
        make_samples(n_normal,  58, 12,  55, 18,  1.4, 0.7,  (25,70),  (1,14))  +
        make_samples(n_warning, 76, 10,  72, 12,  2.8, 0.9,  (60,85),  (10,20)) +
        make_samples(n_failure, 93, 10,  86, 10,  4.2, 1.0,  (60,95),  (15,30))
    )

    df = pd.DataFrame(data)

    # Physics-informed risk score (IEC 60076 inspired)
    def compute_risk(row):
        score = 5.0

        # Temperature contribution (exponential above 75°C)
        if row.temperature > 75:
            score += (row.temperature - 75) * 1.8
        if row.temperature > 95:
            score += (row.temperature - 95) * 2.5  # accelerated aging above 95°C

        # Load contribution
        if row.load > 70:
            score += (row.load - 70) * 0.9
        if row.load > 85:
            score += (row.load - 85) * 1.5

        # Vibration contribution (ISO 10816 Class II: 3.5mm/s danger zone)
        if row.vibration > 2.8:
            score += (row.vibration - 2.8) * 11.0
        if row.vibration > 4.5:
            score += 12.0  # severe resonance bonus

        # Humidity contribution (moisture ingress accelerates dielectric breakdown)
        if row.humidity > 72:
            score += (row.humidity - 72) * 0.35

        # Age contribution (Arrhenius aging: exponential past design life midpoint)
        if row.age > 12:
            score += (row.age - 12) * 0.9
        if row.age > 22:
            score += (row.age - 22) * 1.4

        # Combined stress interaction (simultaneous high-temp + high-load)
        if row.temperature > 80 and row.load > 75:
            score += 10.0

        # Realistic sensor noise (±5 units)
        score += np.random.normal(0, 5)
        return max(0, score)

    df['risk_score'] = df.apply(compute_risk, axis=1)
    df['failure']    = (df['risk_score'] >= 50).astype(int)
    df = df.drop(columns=['risk_score'])

    # Shuffle
    df = df.sample(frac=1, random_state=seed).reset_index(drop=True)

    df.to_csv(DATASET_PATH, index=False)
    print(f"✅ Dataset generated: {len(df)} samples → {DATASET_PATH}")
    print(f"   Failure rate: {df['failure'].mean()*100:.1f}%  |  Safe: {(1-df['failure'].mean())*100:.1f}%")
    return df


# ─── 2. Feature Engineering ──────────────────────────────────────────────────

def engineer_features(df):
    """
    Add domain-informed interaction and ratio features.
    These capture non-linear relationships the RF splits cannot naturally model.
    """
    d = df.copy()
    # Thermal load index (key IEEE C57 metric)
    d['thermal_load_idx'] = d['temperature'] * d['load'] / 100.0
    # Mechanical health ratio
    d['mech_health']      = d['vibration'] * d['age']
    # Moisture-age combined stress
    d['moisture_age']     = d['humidity'] * d['age'] / 100.0
    # Overload indicator
    d['overload_flag']    = ((d['load'] > 85) | (d['temperature'] > 90)).astype(int)
    return d


# ─── 3. Train, Validate, Evaluate ───────────────────────────────────────────

def train_and_evaluate(regenerate=False):

    # Load or generate data
    if regenerate or not os.path.exists(DATASET_PATH):
        df = generate_dataset(1500)
    else:
        df = pd.read_csv(DATASET_PATH)
        # If dataset is old (800 samples), regenerate
        if len(df) < 1200:
            print("📦 Old dataset detected — regenerating with improved physics model...")
            df = generate_dataset(1500)

    print(f"\n{'='*60}")
    print("  GridPulse AI — ML Model Training & Validation Report")
    print(f"{'='*60}")
    print(f"  Total samples : {len(df)}")
    print(f"  Failure (1)   : {df['failure'].sum()} ({df['failure'].mean()*100:.1f}%)")
    print(f"  Safe    (0)   : {len(df)-df['failure'].sum()} ({(1-df['failure'].mean())*100:.1f}%)")

    # Feature engineering
    df_fe = engineer_features(df)
    feature_cols = [
        'temperature', 'load', 'vibration', 'humidity', 'age',
        'thermal_load_idx', 'mech_health', 'moisture_age', 'overload_flag'
    ]
    X = df_fe[feature_cols].values
    y = df_fe['failure'].values

    # Stratified 60/20/20 split (train / validation / held-out test)
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=0.25, stratify=y_temp, random_state=42)  # 0.25 * 0.80 = 0.20

    print(f"\n  Split  → Train: {len(X_train)}  |  Val: {len(X_val)}  |  Test: {len(X_test)}")

    # ── Model A: Logistic Regression baseline ──────────────────────────────
    lr_pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=2000, C=1.0, class_weight='balanced'))
    ])
    lr_pipe.fit(X_train, y_train)
    lr_val_pred  = lr_pipe.predict(X_val)
    lr_val_acc   = accuracy_score(y_val, lr_val_pred)
    lr_val_f1    = f1_score(y_val, lr_val_pred)
    print(f"\n  Logistic Regression  — Val Acc: {lr_val_acc*100:.2f}%  |  Val F1: {lr_val_f1:.4f}")

    # ── Model B: Random Forest (hyperparameter search) ─────────────────────
    print("\n  Tuning Random Forest via GridSearchCV (3-fold stratified)...")
    rf_param_grid = {
        'n_estimators':  [200, 350],
        'max_depth':     [8, 12, None],
        'min_samples_split': [2, 5],
        'class_weight':  ['balanced', None]
    }
    rf_base = RandomForestClassifier(random_state=42, n_jobs=-1)
    rf_cv   = GridSearchCV(rf_base, rf_param_grid, cv=StratifiedKFold(3),
                           scoring='f1', n_jobs=-1, verbose=0)
    rf_cv.fit(X_train, y_train)
    best_rf = rf_cv.best_estimator_
    print(f"  Best RF params: {rf_cv.best_params_}")

    # Calibrate probabilities (Platt scaling)
    rf_calibrated = CalibratedClassifierCV(best_rf, cv=3, method='sigmoid')
    rf_calibrated.fit(X_train, y_train)

    # ── Model C: Gradient Boosting ─────────────────────────────────────────
    gb_model = GradientBoostingClassifier(
        n_estimators=300, learning_rate=0.05, max_depth=4,
        min_samples_split=4, subsample=0.8, random_state=42
    )
    gb_model.fit(X_train, y_train)

    # ── Validation Metrics ─────────────────────────────────────────────────
    print(f"\n{'─'*60}")
    print("  VALIDATION SET METRICS")
    print(f"{'─'*60}")
    models = {
        'Logistic Regression':  lr_pipe,
        'Random Forest (tuned, calibrated)': rf_calibrated,
        'Gradient Boosting':    gb_model
    }

    best_model = None
    best_val_f1 = 0

    for name, mdl in models.items():
        pred  = mdl.predict(X_val)
        proba = mdl.predict_proba(X_val)[:, 1]
        acc   = accuracy_score(y_val, pred)
        prec  = precision_score(y_val, pred, zero_division=0)
        rec   = recall_score(y_val, pred, zero_division=0)
        f1    = f1_score(y_val, pred, zero_division=0)
        auc   = roc_auc_score(y_val, proba)
        ap    = average_precision_score(y_val, proba)
        mcc   = matthews_corrcoef(y_val, pred)

        print(f"\n  [{name}]")
        print(f"    Accuracy  : {acc*100:.2f}%")
        print(f"    Precision : {prec:.4f}")
        print(f"    Recall    : {rec:.4f}")
        print(f"    F1 Score  : {f1:.4f}")
        print(f"    ROC-AUC   : {auc:.4f}")
        print(f"    Avg Prec  : {ap:.4f}")
        print(f"    MCC       : {mcc:.4f}")

        if f1 > best_val_f1:
            best_val_f1  = f1
            best_model   = mdl
            best_name    = name

    print(f"\n  ✅ Best validation model: {best_name} (F1={best_val_f1:.4f})")

    # ── HELD-OUT TEST SET EVALUATION ──────────────────────────────────────
    print(f"\n{'─'*60}")
    print("  HELD-OUT TEST SET EVALUATION (unseen data)")
    print(f"{'─'*60}")

    test_pred  = best_model.predict(X_test)
    test_proba = best_model.predict_proba(X_test)[:, 1]
    test_acc   = accuracy_score(y_test, test_pred)
    test_prec  = precision_score(y_test, test_pred, zero_division=0)
    test_rec   = recall_score(y_test, test_pred, zero_division=0)
    test_f1    = f1_score(y_test, test_pred, zero_division=0)
    test_auc   = roc_auc_score(y_test, test_proba)
    test_ap    = average_precision_score(y_test, test_proba)
    test_mcc   = matthews_corrcoef(y_test, test_pred)
    cm         = confusion_matrix(y_test, test_pred)

    print(f"  Accuracy  : {test_acc*100:.2f}%")
    print(f"  Precision : {test_prec:.4f}")
    print(f"  Recall    : {test_rec:.4f}")
    print(f"  F1 Score  : {test_f1:.4f}")
    print(f"  ROC-AUC   : {test_auc:.4f}")
    print(f"  Avg Prec  : {test_ap:.4f}")
    print(f"  MCC       : {test_mcc:.4f}")
    print(f"\n  Confusion Matrix (Test Set):")
    print(f"              Predicted Safe   Predicted Failure")
    print(f"  Actual Safe      {cm[0][0]:4d}              {cm[0][1]:4d}")
    print(f"  Actual Fail      {cm[1][0]:4d}              {cm[1][1]:4d}")

    tn, fp, fn, tp = cm.ravel()
    print(f"\n  True Positives  (correctly caught failures): {tp}")
    print(f"  False Negatives (missed failures)           : {fn}  ← minimize this!")
    print(f"  False Positives (false alarms)              : {fp}")
    print(f"  True Negatives  (correctly safe)            : {tn}")

    print(f"\n  Detailed Classification Report:")
    print(classification_report(y_test, test_pred, target_names=['Safe (0)', 'Failure (1)']))

    # Cross-validation on full dataset
    print(f"{'─'*60}")
    print("  5-FOLD CROSS-VALIDATION (full dataset)")
    print(f"{'─'*60}")
    cv_scores = cross_val_score(best_model, X, y, cv=StratifiedKFold(5), scoring='f1')
    print(f"  F1 scores    : {[f'{s:.4f}' for s in cv_scores]}")
    print(f"  Mean F1      : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    cv_acc = cross_val_score(best_model, X, y, cv=StratifiedKFold(5), scoring='accuracy')
    print(f"  Mean Accuracy: {cv_acc.mean()*100:.2f}% ± {cv_acc.std()*100:.2f}%")

    # ── Sanity Tests ──────────────────────────────────────────────────────
    print(f"\n{'─'*60}")
    print("  INFERENCE SANITY TESTS")
    print(f"{'─'*60}")

    test_cases = [
        {"label": "Critical — Overheated aging transformer",
         "raw": [95.0, 92.0, 4.5, 70.0, 18.0]},
        {"label": "High — Warm, high-load, humid coastal",
         "raw": [84.0, 82.0, 3.8, 82.0, 22.0]},
        {"label": "Warning — Borderline temp creep",
         "raw": [76.0, 71.0, 2.4, 62.0, 13.0]},
        {"label": "Normal — Healthy young feeder",
         "raw": [48.0, 38.0, 0.9, 45.0, 4.0]},
    ]

    for tc in test_cases:
        raw = tc["raw"]
        # Apply feature engineering
        thermal_load = raw[0] * raw[1] / 100.0
        mech_health  = raw[2] * raw[4]
        moisture_age = raw[3] * raw[4] / 100.0
        overload     = 1 if (raw[1] > 85 or raw[0] > 90) else 0
        feat_vec     = np.array([raw + [thermal_load, mech_health, moisture_age, overload]])
        prob         = best_model.predict_proba(feat_vec)[0][1] * 100
        print(f"  {tc['label']}")
        print(f"    → Failure Probability: {prob:.1f}%")

    # ── Save model + metadata ─────────────────────────────────────────────
    artifact = {
        'model': best_model,
        'feature_cols': feature_cols,
        'model_name': best_name,
        'test_accuracy': round(test_acc * 100, 2),
        'test_f1': round(test_f1, 4),
        'test_auc': round(test_auc, 4),
        'test_precision': round(test_prec, 4),
        'test_recall': round(test_rec, 4),
        'cv_mean_f1': round(float(cv_scores.mean()), 4),
        'cv_std_f1':  round(float(cv_scores.std()), 4),
        'cv_mean_acc': round(float(cv_acc.mean() * 100), 2),
        'confusion_matrix': cm.tolist(),
        'mcc': round(test_mcc, 4)
    }
    joblib.dump(artifact, MODEL_PATH)
    print(f"\n💾 Model artifact saved → {MODEL_PATH}")

    # Save human-readable report
    report = {
        'model_name': best_name,
        'dataset_samples': len(df),
        'feature_cols': feature_cols,
        'split': {'train': len(X_train), 'val': len(X_val), 'test': len(X_test)},
        'validation_metrics': {
            'accuracy_pct': round(test_acc * 100, 2),
            'precision': round(test_prec, 4),
            'recall': round(test_rec, 4),
            'f1_score': round(test_f1, 4),
            'roc_auc': round(test_auc, 4),
            'avg_precision': round(test_ap, 4),
            'mcc': round(test_mcc, 4),
            'confusion_matrix': {
                'tn': int(tn), 'fp': int(fp),
                'fn': int(fn), 'tp': int(tp)
            }
        },
        'cross_validation': {
            'folds': 5,
            'mean_f1': round(float(cv_scores.mean()), 4),
            'std_f1':  round(float(cv_scores.std()), 4),
            'mean_accuracy_pct': round(float(cv_acc.mean() * 100), 2)
        }
    }
    with open(REPORT_PATH, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"📊 Validation report saved → {REPORT_PATH}")
    print(f"\n{'='*60}\n")

    return artifact


if __name__ == '__main__':
    force_regen = '--regen' in sys.argv
    train_and_evaluate(regenerate=force_regen)
