#!/usr/bin/env python3
"""
GridPulse AI – Model Inference Script
Accepts JSON sensor telemetry: {"temperature": 85, "load": 80, "vibration": 3.8, "humidity": 60, "age": 15}
Outputs JSON with failure probability, risk category, possible failure, and recommended action.
"""

import sys
import os
import json
import numpy as np
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')

def get_risk_category(score):
    if score >= 86:
        return 'Critical'
    elif score >= 71:
        return 'High'
    elif score >= 41:
        return 'Warning'
    return 'Normal'

def get_diagnostics(temp, load, vib, hum, age, prob, category):
    reasons = []
    if temp > 75:
        reasons.append(f"High temperature ({temp}°C) exceeds 75°C threshold")
    if load > 75:
        reasons.append(f"Elevated load ({load}%) causing winding heating")
    if vib > 2.5:
        reasons.append(f"Increased vibration ({vib} mm/s) indicates mechanical resonance")
    if hum > 75:
        reasons.append(f"High ambient moisture ({hum}%) accelerates insulation breakdown")
    if age > 15:
        reasons.append(f"Asset age ({age} years) increases component fatigue")

    if category == 'Critical':
        possible_failure = "Transformer Overheating & Dielectric Thermal Breakdown" if temp > 80 else "Severe Mechanical Resonance & Bearing Wear"
        recommendation = "Immediate on-site inspection required. Reduce feeder load immediately, inspect forced-air cooling fans, and dispatch emergency repair team."
    elif category == 'High':
        possible_failure = "Thermal Stress & Accelerated Insulation Degradation"
        recommendation = "Schedule high-priority inspection within 24 hours. Check oil level sight glass, test dielectric breakdown voltage, and monitor hourly load."
    elif category == 'Warning':
        possible_failure = "Moderate Temperature Rise & Peak Load Creep"
        recommendation = "Monitor temperature closely during peak hours. Perform preventive infrared thermography scan during next routine window."
    else:
        possible_failure = "Nominal Operational Condition"
        recommendation = "Maintain standard automated telemetry monitoring. No immediate maintenance intervention required."

    return possible_failure, recommendation, reasons

def predict(payload):
    temp = float(payload.get('temperature', 60.0))
    load = float(payload.get('load', 50.0))
    vib = float(payload.get('vibration', 1.5))
    hum = float(payload.get('humidity', 50.0))
    age = float(payload.get('age', 10.0))

    prob = 20.0 # default baseline
    model_name = "Random Forest Classifier (Scikit-Learn)"

    if os.path.exists(MODEL_PATH):
        try:
            import pandas as pd
            model = joblib.load(MODEL_PATH)
            sample_df = pd.DataFrame(
                [[temp, load, vib, hum, age]], 
                columns=['temperature', 'load', 'vibration', 'humidity', 'age']
            )
            # Probability of failure (class 1)
            prob = float(model.predict_proba(sample_df)[0][1] * 100)
        except Exception as e:
            # Fallback calculation if model load fails
            model_name = "Calibrated Diagnostic Model (Fallback)"
            prob = min(99.0, max(5.0, 15.0 + (max(0, temp-70)*1.6) + (max(0, load-65)*0.9) + (max(0, vib-2.5)*14.0)))
    else:
        model_name = "Calibrated Diagnostic Baseline"
        prob = min(99.0, max(5.0, 15.0 + (max(0, temp-70)*1.6) + (max(0, load-65)*0.9) + (max(0, vib-2.5)*14.0)))

    prob = round(prob, 1)
    category = get_risk_category(prob)
    possible_failure, recommendation, reasons = get_diagnostics(temp, load, vib, hum, age, prob, category)

    return {
        "failureProbability": prob,
        "riskCategory": category,
        "possibleFailure": possible_failure,
        "recommendation": recommendation,
        "reasons": reasons,
        "modelUsed": model_name
    }

if __name__ == '__main__':
    # Parse input from CLI arg or stdin
    input_str = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
    try:
        data = json.loads(input_str)
        result = predict(data)
        print(json.dumps(result))
    except Exception as err:
        sys.stderr.write(f"Error: {str(err)}\n")
        sys.exit(1)
