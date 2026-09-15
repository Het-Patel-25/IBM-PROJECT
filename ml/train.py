#!/usr/bin/env python3
"""
GridPulse AI – Machine Learning Model Training Script
College Project: Electrical Grid Asset Failure Prediction

Features:
  - temperature (°C)
  - load (%)
  - vibration (mm/s)
  - humidity (%)
  - age (years)

Target:
  - failure (0: Safe/Normal, 1: High Risk of Failure)
"""

import os
import random
import csv
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'grid_sensor_dataset.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')

def generate_simulated_dataset(num_samples=800):
    """
    Generates a realistic electrical grid asset telemetry dataset.
    Physics-informed rules determine the failure probability:
    - Temp > 80°C dramatically increases failure risk
    - Load > 80% with high temp accelerates thermal runaway
    - Vibration > 3.5 mm/s indicates mechanical looseness / bearing failure
    - High humidity (> 75%) with old age (> 15 yrs) increases moisture breakdown
    """
    np.random.seed(42)
    random.seed(42)

    rows = []
    for _ in range(num_samples):
        # Realistic ranges
        temp = round(np.random.normal(68, 18), 1)
        temp = max(25.0, min(125.0, temp))

        load = round(np.random.normal(62, 22), 1)
        load = max(15.0, min(120.0, load))

        vibration = round(np.random.exponential(1.8), 2)
        vibration = max(0.4, min(7.5, vibration))

        humidity = round(np.random.uniform(25.0, 95.0), 1)
        age = round(np.random.uniform(1.0, 30.0), 1)

        # Risk scoring equation (simulates real transformer thermodynamic degradation)
        risk_score = 0
        if temp > 75:
            risk_score += (temp - 75) * 1.5
        if temp > 90:
            risk_score += 15

        if load > 70:
            risk_score += (load - 70) * 0.8
        if load > 85:
            risk_score += 12

        if vibration > 2.5:
            risk_score += (vibration - 2.5) * 12

        if humidity > 75:
            risk_score += (humidity - 75) * 0.3

        if age > 15:
            risk_score += (age - 15) * 0.7

        # Add small random noise to simulate sensor variances (+/- 6)
        risk_score += np.random.normal(0, 6)

        # Failure threshold: risk_score >= 50
        failure = 1 if risk_score >= 48 else 0

        rows.append({
            'temperature': temp,
            'load': load,
            'vibration': vibration,
            'humidity': humidity,
            'age': age,
            'failure': failure
        })

    df = pd.DataFrame(rows)
    df.to_csv(DATASET_PATH, index=False)
    print(f"✅ Generated dataset with {len(df)} samples saved to: {DATASET_PATH}")
    return df

def train_and_evaluate():
    # 1. Load or Generate Data
    if not os.path.exists(DATASET_PATH):
        df = generate_simulated_dataset(800)
    else:
        df = pd.read_csv(DATASET_PATH)

    print("\n--- Dataset Summary ---")
    print(f"Total Records: {len(df)}")
    print(f"Failures (1): {df['failure'].sum()} ({df['failure'].mean()*100:.1f}%)")
    print(f"Safe (0): {len(df) - df['failure'].sum()} ({(1 - df['failure'].mean())*100:.1f}%)")

    # Features and Target
    feature_cols = ['temperature', 'load', 'vibration', 'humidity', 'age']
    X = df[feature_cols]
    y = df['failure']

    # Train / Test split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 2. Train Models
    print("\n--- Training Machine Learning Models ---")
    
    # Model A: Logistic Regression Baseline
    log_reg = LogisticRegression(max_iter=1000)
    log_reg.fit(X_train, y_train)
    log_pred = log_reg.predict(X_test)
    log_acc = accuracy_score(y_test, log_pred)
    print(f"Logistic Regression Test Accuracy: {log_acc * 100:.2f}%")

    # Model B: Random Forest Classifier (Primary Model)
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_pred)
    print(f"Random Forest Test Accuracy:        {rf_acc * 100:.2f}%")

    # 3. Model Evaluation Details
    print("\n--- Random Forest Classification Report ---")
    print(classification_report(y_test, rf_pred, target_names=['Normal (0)', 'Failure (1)']))

    print("--- Feature Importances ---")
    for feat, imp in zip(feature_cols, rf_model.feature_importances_):
        print(f"  • {feat:12s}: {imp * 100:.2f}%")

    # 4. Save Trained Random Forest Model
    joblib.dump(rf_model, MODEL_PATH)
    print(f"\n💾 Model successfully saved to: {MODEL_PATH}")

    # 5. Sanity Test Inference
    test_sample = np.array([[95.0, 92.0, 4.5, 70.0, 18.0]]) # Hot, overloaded, vibrating transformer
    prob_failure = rf_model.predict_proba(test_sample)[0][1] * 100
    print(f"\n🧪 Verification Test Sample (Critical Case):")
    print(f"   Inputs: Temp=95°C, Load=92%, Vib=4.5mm/s, Hum=70%, Age=18yrs")
    print(f"   Predicted Failure Probability: {prob_failure:.1f}%")

if __name__ == '__main__':
    train_and_evaluate()
